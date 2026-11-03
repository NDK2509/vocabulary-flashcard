export const AUTH_COOKIE_NAME = 'auth_session';
export const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'vocabcards-default-secret-salt-2026-production';

const encoder = new TextEncoder();

/**
 * Signs a session token with HMAC-SHA256 using universal Web Crypto API.
 * Format: `<token>.<signature>`
 */
export async function signTokenEdge(token: string, secret = AUTH_SECRET): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(token));
  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${token}.${signatureHex}`;
}

/**
 * Verifies a signed session token using universal Web Crypto API.
 * Returns raw token if valid, or null otherwise.
 */
export async function verifyTokenEdge(
  signedToken: string,
  secret = AUTH_SECRET
): Promise<string | null> {
  try {
    const parts = signedToken.split('.');
    if (parts.length !== 2) return null;

    const [token, signatureHex] = parts;
    if (!token || !signatureHex) return null;

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const match = signatureHex.match(/.{1,2}/g);
    if (!match) return null;
    const signatureBytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(token)
    );

    return isValid ? token : null;
  } catch {
    return null;
  }
}

