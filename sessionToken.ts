// Session Token Generation for Coinbase Developer Platform
// Uses Node.js subprocess for CDP SDK compatibility

// J1.CCP wallet address for direct deposits
const J1_CCP_ADDRESS = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

interface SessionTokenRequest {
  addresses: Array<{
    address: string;
    blockchains: string[];
  }>;
  assets?: string[];
}

interface SessionTokenResponse {
  token: string;
  channel_id?: string;
}

/**
 * Generate session token by calling Node.js script
 */
export async function generateSessionToken(
  params: SessionTokenRequest
): Promise<SessionTokenResponse> {
  try {
    // Use J1.CCP address as destination
    const requestBody = {
      addresses: params.addresses || [{
        address: J1_CCP_ADDRESS,
        blockchains: ["ethereum", "base", "polygon", "arbitrum", "optimism"]
      }],
      ...(params.assets && { assets: params.assets }),
    };

    console.log('Generating session token for addresses:', requestBody.addresses);

    // Call Node.js script to generate token
    // Pass environment variables to the subprocess
    const process = new Deno.Command("node", {
      args: ["api/generateToken.mjs", JSON.stringify(requestBody)],
      stdin: "null",
      stdout: "piped",
      stderr: "piped",
      env: {
        CDP_API_KEY: Deno.env.get("CDP_API_KEY") || "",
        CDP_API_SECRET: Deno.env.get("CDP_API_SECRET") || "",
        ...Deno.env.toObject()
      }
    });

    const { code, stdout, stderr } = await process.output();

    if (code !== 0) {
      const errorText = new TextDecoder().decode(stderr);
      console.error('Token generation failed:', errorText);
      throw new Error('Failed to generate session token');
    }

    const outputText = new TextDecoder().decode(stdout);
    const data = JSON.parse(outputText);

    console.log('Successfully generated session token');

    return {
      token: data.token,
      channel_id: data.channel_id,
    };
  } catch (error) {
    console.error('Error generating session token:', error);
    throw error;
  }
}

/**
 * Handle session token API request
 */
export async function handleSessionRequest(req: Request): Promise<Response> {
  try {
    // Parse request body
    const body = await req.json() as SessionTokenRequest;

    // Generate session token
    const tokenResponse = await generateSessionToken(body);

    // Return success response
    return new Response(JSON.stringify(tokenResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Session token error:', error);

    // Return error response
    return new Response(JSON.stringify({
      error: 'Failed to generate session token',
      details: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}