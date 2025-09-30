// Mock API functions for demo purposes

/**
 * Sets a session for the authenticated user
 * @param {Object} params - Session parameters
 * @param {Object} params.message - SIWE message
 * @param {string} params.signature - Message signature
 * @returns {Promise<Object>} Session data
 */
export const setSession = async ({ message, signature }) => {
  console.log("Setting session with:", { message, signature });
  // In a real implementation, this would make an API call to set the session
  return { success: true };
};

/**
 * Generates a secure token for transactions
 * @param {Object} params - Token parameters
 * @param {string} params.ethAddress - Ethereum address
 * @param {Array<string>} params.blockchains - Supported blockchains
 * @param {string} [params.partnerUserId] - Optional partner user ID
 * @returns {Promise<string>} Secure token
 */
export const generateSecureToken = async ({
  ethAddress,
  blockchains,
  partnerUserId,
}) => {
  console.log("Generating secure token for:", {
    ethAddress,
    blockchains,
    partnerUserId,
  });
  // In a real implementation, this would make an API call to generate a token
  return "mock-secure-token-" + Math.random().toString(36).substring(2, 15);
};

/**
 * Gets orders by partner user ID
 * @param {Object} params - Query parameters
 * @param {string} params.partnerUserId - Partner user ID
 * @returns {Promise<Array<Object>>} List of orders
 */
export const getOrdersByPartnerUserId = async ({ partnerUserId }) => {
  console.log("Getting orders for partner user ID:", partnerUserId);
  // In a real implementation, this would make an API call to fetch orders

  // Return mock data
  return [
    {
      id: "order-1",
      created_at: new Date().toISOString(),
      type: "buy",
      asset: "BTC",
      amount: "0.001",
      status: "completed",
    },
    {
      id: "order-2",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      type: "buy",
      asset: "ETH",
      amount: "0.1",
      status: "pending",
    },
    {
      id: "order-3",
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      type: "sell",
      asset: "BTC",
      amount: "0.002",
      status: "failed",
    },
  ];
};
