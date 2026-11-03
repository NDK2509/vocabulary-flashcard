import crypto from 'crypto';

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'vocabcards-default-secret-salt-2026-production';

/**
 * Hashes a plaintext password using scrypt with a unique random salt.
 * Returns format: "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored "salt:hash" string
 * using constant-time comparison to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);

    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Generates a cryptographically random session token (64 hex characters).
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Signs a raw session token with HMAC-SHA256.
 * Output format: `<token>.<signature>`
 */
export function signToken(token: string): string {
  const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(token).digest('hex');
  return `${token}.${hmac}`;
}

/**
 * Verifies and extracts the raw token from a signed token string.
 * Returns the raw token if the signature is valid, or null otherwise.
 */
export function verifySignedToken(signedToken: string): string | null {
  try {
    const parts = signedToken.split('.');
    if (parts.length !== 2) return null;

    const [token, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(token).digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const actualBuffer = Buffer.from(signature, 'hex');

    if (expectedBuffer.length !== actualBuffer.length) return null;
    if (!crypto.timingSafeEqual(expectedBuffer, actualBuffer)) return null;

    return token;
  } catch {
    return null;
  }
}

