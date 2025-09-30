// Stub for sessionToken.ts - actual implementation requires Node.js subprocess
// which is not available in Deno Deploy

export interface SessionTokenRequest {
  addresses: Array<{
    address: string;
    blockchains: string[];
  }>;
  assets?: string[];
}

export interface SessionTokenResponse {
  token: string;
  channel_id?: string;
}

/**
 * Stub implementation - returns error response
 * Real implementation requires CDP API keys and Node.js
 */
export async function generateSessionToken(
  params: SessionTokenRequest
): Promise<SessionTokenResponse> {
  console.warn('Session token generation not available in production deployment');
  throw new Error('Session token generation requires backend API');
}

/**
 * Handle session token API request
 */
export async function handleSessionRequest(req: Request): Promise<Response> {
  return new Response(JSON.stringify({
    error: 'Session token API not available in production',
    details: 'This feature requires a backend API server with CDP credentials',
  }), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}