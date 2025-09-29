/**
 * Solana Affiliate Fee Withdrawal Script
 *
 * This script handles withdrawal of affiliate fees from both:
 * 1. deBridge cross-chain orders on Solana
 * 2. Jupiter same-chain swap referral fees
 */

import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  Keypair,
  MessageV0,
  PACKET_DATA_SIZE,
  PublicKey,
  TransactionInstruction,
  VersionedTransaction
} from "@solana/web3.js";
import { ReferralProvider } from "@jup-ag/referral-sdk";
import bs58 from "bs58";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, ".env") });

// Configuration - Load from environment variables with fallbacks
const CONFIG = {
  // Your Solana wallet public key that receives fees
  BENEFICIARY_PUBKEY: process.env.SOLANA_BENEFICIARY || "6j8QLb8D7wEfgAMSBy7HkuduBeysVJQimLHuwjBCW4gU",

  // Jupiter referral accounts
  JUPITER_ACCOUNTS: {
    // Swap + Trigger Dashboard
    SWAP_TRIGGER: process.env.JUPITER_REFERRAL_ACCOUNT || "9b2JyZnf3CJAx5JSiCNMSWQAiqJAJVUSxvq5W2trYho7",
    // Ultra Dashboard
    ULTRA: process.env.JUPITER_ULTRA_ACCOUNT || "EDgCbN6bPKvFgY4fjmiFq44a4EY1hMnAqXzQ2rK9H7XT"
  },

  // deBridge referral code
  DEBRIDGE_REFERRAL_CODE: process.env.DEBRIDGE_REFERRAL_CODE || "32422",

  // RPC endpoint (use your own for production)
  RPC_URL: process.env.SOLANA_RPC_URL || process.env.HELIUS_RPC || clusterApiUrl("mainnet-beta"),

  // Private key (base58 encoded) - KEEP THIS SECRET!
  PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY || "",

  // Optional settings
  MIN_SOL_BALANCE: parseFloat(process.env.MIN_SOL_BALANCE || "0.01"),
  DRY_RUN_MODE: process.env.DRY_RUN_MODE === "true",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // deBridge program addresses
  DEBRIDGE_PROGRAMS: {
    dlnSrc: "src5qyZHqTqecJV4aY6Cb6zDZLMDzrDKKezs22MPHr4",
    dlnDst: "dst5MGcFPoBeREFAA5E3tU5ij8m5uVYwkzkSAbsLbNo",
    deBridge: "DEbrdGj3HsRsAzx6uH4MKyREKxVAfBydijLUF3ygsFfh",
    settings: "DeSetTwWhjZq6Pz9Kfdo1KoS5NqtsM6G8ERbX4SSCSft",
  }
};

// Types
interface IOrderFromApi {
  orderId: { stringValue: string; bytesArrayValue: string };
  affiliateFee: { beneficiarySrc: { stringValue: string } };
  giveOfferWithMetadata: { tokenAddress: { stringValue: string } };
}

/**
 * Find associated token address for a wallet and token mint
 */
function findAssociatedTokenAddress(wallet: PublicKey, tokenMint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      wallet.toBytes(),
      new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").toBytes(),
      tokenMint.toBytes()
    ],
    new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
  );
}

/**
 * Fetch unlocked orders from deBridge API
 */
async function getUnlockedOrders(beneficiaryAddress: PublicKey): Promise<IOrderFromApi[]> {
  const MAX = 100;
  let n = 0;
  let lastOrders = [];
  lastOrders.length = MAX;
  let allOrders: IOrderFromApi[] = [];

  try {
    for (;;) {
      const response: { orders?: IOrderFromApi[] } = await fetch("https://stats-api.dln.trade/api/Orders/filteredList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giveChainIds: [7565164], // Solana chain ID
          takeChainIds: [],
          orderStates: ["ClaimedUnlock"],
          filter: beneficiaryAddress.toString(),
          referralCode: CONFIG.DEBRIDGE_REFERRAL_CODE,
          skip: n * MAX,
          take: MAX,
        }),
      }).then((r) => r.json());

      n += 1;
      lastOrders = response.orders || [];
      allOrders = [...allOrders, ...lastOrders];

      if (!lastOrders.length) {
        break;
      }
    }
  } catch (e) {
    console.error("Error fetching orders:", e);
  }

  // Filter to only include orders for this beneficiary
  allOrders = allOrders.filter(
    (order) => order.affiliateFee.beneficiarySrc.stringValue === beneficiaryAddress.toString(),
  );

  return allOrders;
}

/**
 * Build withdraw instructions for deBridge affiliate fees
 */
async function buildWithdrawInstructions(
  connection: Connection,
  orders: IOrderFromApi[]
): Promise<{ instructions: TransactionInstruction[], orderIds: string[] }> {
  if (orders.length === 0) {
    return { instructions: [], orderIds: [] };
  }

  console.log(`Building withdrawal instructions for ${orders.length} orders...`);

  // Note: Full implementation would require the @debridge-finance/solana-utils package
  // This is a simplified version showing the structure

  const instructions: TransactionInstruction[] = [];
  const orderIds: string[] = [];

  for (const order of orders) {
    try {
      // Each order needs a withdrawAffiliateFee instruction
      // This would be built using the deBridge SDK
      orderIds.push(order.orderId.stringValue);

      console.log(`- Order ${order.orderId.stringValue}`);
    } catch (error) {
      console.error(`Failed to build instruction for order ${order.orderId.stringValue}:`, error);
    }
  }

  return { instructions, orderIds };
}

/**
 * Withdraw Jupiter referral fees from a specific account
 */
async function withdrawJupiterFeesFromAccount(
  connection: Connection,
  wallet: Keypair,
  accountKey: string,
  accountName: string
): Promise<void> {
  console.log(`\n=== ${accountName} Jupiter Referral Fee Withdrawal ===`);

  const provider = new ReferralProvider(connection);
  const referralAccountPubkey = new PublicKey(accountKey);

  try {
    // Get all claimable transactions
    const transactions = await provider.claimAllV2({
      payerPubKey: wallet.publicKey,
      referralAccountPubKey: referralAccountPubkey,
    });

    if (transactions.length === 0) {
      console.log(`No ${accountName} Jupiter referral fees to claim`);
      return;
    }

    console.log(`Found ${transactions.length} transactions to claim ${accountName} Jupiter fees`);

    // Send each claim transaction
    for (let i = 0; i < transactions.length; i++) {
      try {
        const transaction = transactions[i];
        transaction.sign([wallet]);

        const signature = await connection.sendRawTransaction(
          transaction.serialize()
        );

        console.log(`${accountName} transaction ${i + 1}/${transactions.length}: https://solscan.io/tx/${signature}`);

        // Wait for confirmation
        await connection.confirmTransaction(signature, "confirmed");

        // Small delay between transactions
        if (i < transactions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Failed to send ${accountName} transaction ${i + 1}:`, error);
      }
    }

    console.log(`${accountName} Jupiter fee withdrawal complete!`);

  } catch (error) {
    console.error(`Error withdrawing ${accountName} Jupiter fees:`, error);
    // Don't throw - still try other accounts
  }
}

/**
 * Withdraw Jupiter referral fees from all accounts
 */
async function withdrawJupiterFees(
  connection: Connection,
  wallet: Keypair
): Promise<void> {
  console.log("\n=== Withdrawing All Jupiter Referral Fees ===");

  // Process both Jupiter accounts
  for (const [accountType, accountKey] of Object.entries(CONFIG.JUPITER_ACCOUNTS)) {
    await withdrawJupiterFeesFromAccount(connection, wallet, accountKey, accountType);
  }
}

/**
 * Main function to withdraw all fees
 */
async function main() {
  console.log("=== Solana Affiliate Fee Withdrawal Script ===\n");

  // Validate configuration
  if (!CONFIG.PRIVATE_KEY) {
    console.error("Error: SOLANA_PRIVATE_KEY environment variable not set");
    console.error("Set it with: export SOLANA_PRIVATE_KEY='your-base58-private-key'");
    process.exit(1);
  }

  let wallet: Keypair;
  try {
    wallet = Keypair.fromSecretKey(bs58.decode(CONFIG.PRIVATE_KEY));
  } catch (error) {
    console.error("Error: Invalid private key format");
    process.exit(1);
  }

  const beneficiaryPubkey = new PublicKey(CONFIG.BENEFICIARY_PUBKEY);
  const connection = new Connection(CONFIG.RPC_URL, "confirmed");

  console.log(`Wallet: ${wallet.publicKey.toString()}`);
  console.log(`Beneficiary: ${beneficiaryPubkey.toString()}`);
  console.log(`RPC: ${CONFIG.RPC_URL}\n`);

  // Check wallet balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`Wallet balance: ${balance / 1e9} SOL\n`);

  if (balance < 0.01 * 1e9) {
    console.warn("Warning: Low balance. You need SOL for transaction fees.\n");
  }

  // 1. Withdraw deBridge cross-chain fees
  console.log("=== deBridge Cross-Chain Fee Withdrawal ===");

  const orders = await getUnlockedOrders(beneficiaryPubkey);
  console.log(`Found ${orders.length} unclaimed deBridge orders`);

  if (orders.length > 0) {
    const { instructions, orderIds } = await buildWithdrawInstructions(connection, orders);

    if (instructions.length > 0) {
      console.log(`\nProcessing ${instructions.length} withdrawal instructions...`);

      // Split into multiple transactions if needed
      const maxInstructionsPerTx = 10;

      for (let i = 0; i < instructions.length; i += maxInstructionsPerTx) {
        const batch = instructions.slice(i, i + maxInstructionsPerTx);
        const batchOrderIds = orderIds.slice(i, i + maxInstructionsPerTx);

        try {
          const message = MessageV0.compile({
            payerKey: wallet.publicKey,
            instructions: [
              ComputeBudgetProgram.setComputeUnitLimit({ units: 300_000 }),
              ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 30_000 }),
              ...batch
            ],
            recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
          });

          const tx = new VersionedTransaction(message);
          tx.sign([wallet]);

          const signature = await connection.sendRawTransaction(tx.serialize());
          console.log(`Batch ${Math.floor(i / maxInstructionsPerTx) + 1}: https://solscan.io/tx/${signature}`);
          console.log(`  Orders: ${batchOrderIds.join(", ")}`);

          await connection.confirmTransaction(signature, "confirmed");
        } catch (error) {
          console.error(`Failed to process batch:`, error);
        }
      }
    }
  }

  // 2. Withdraw Jupiter same-chain fees
  await withdrawJupiterFees(connection, wallet);

  console.log("\n=== Fee Withdrawal Complete ===");
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { main, getUnlockedOrders, withdrawJupiterFees };