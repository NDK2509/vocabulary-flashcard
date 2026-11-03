import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  signToken,
  verifySignedToken,
} from './crypto';
import { signTokenEdge, verifyTokenEdge } from './token';

describe('Auth Crypto Utilities', () => {
  it('hashes password and verifies successfully with correct password', () => {
    const password = 'mySecretPassword123';
    const hash = hashPassword(password);

    expect(hash).toContain(':');
    expect(verifyPassword(password, hash)).toBe(true);
  });

  it('fails verification with wrong password', () => {
    const password = 'mySecretPassword123';
    const hash = hashPassword(password);

    expect(verifyPassword('wrongPassword', hash)).toBe(false);
  });

  it('fails verification gracefully on malformed hash', () => {
    expect(verifyPassword('test', '')).toBe(false);
    expect(verifyPassword('test', 'malformed-without-colon')).toBe(false);
    expect(verifyPassword('test', 'invalid:nonhexvalue')).toBe(false);
  });

  it('generates random tokens of 64 hex characters', () => {
    const token1 = generateToken();
    const token2 = generateToken();

    expect(token1).toHaveLength(64);
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);
  });

  it('signs and verifies session tokens correctly with HMAC', () => {
    const token = generateToken();
    const signed = signToken(token);

    expect(signed.startsWith(`${token}.`)).toBe(true);

    const extracted = verifySignedToken(signed);
    expect(extracted).toBe(token);
  });

  it('rejects tampered signed tokens', () => {
    const token = generateToken();
    const signed = signToken(token);

    // Tampered payload
    const tampered = `tampered${signed.slice(8)}`;
    expect(verifySignedToken(tampered)).toBeNull();

    // Tampered signature
    const [t] = signed.split('.');
    expect(verifySignedToken(`${t}.1234567890abcdef`)).toBeNull();
  });

  it('supports universal Web Crypto edge token verification', async () => {
    const token = generateToken();
    const signed = await signTokenEdge(token);

    const verified = await verifyTokenEdge(signed);
    expect(verified).toBe(token);

    const invalid = await verifyTokenEdge('invalid.signature');
    expect(invalid).toBeNull();
  });
});

