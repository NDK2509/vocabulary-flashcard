import {
  hashPassword,
  verifyPassword,
  generateToken,
  signToken,
  verifySignedToken,
} from './crypto';
import {
  findUserByEmail,
  insertUser,
  createDbSession,
  findSessionAndUser,
  deleteDbSession,
} from './db';
import {
  SESSION_MAX_AGE,
  clearAuthSessionCookie,
  getAuthSessionCookie,
} from './session';
import { AuthUser } from './types';

export * from './types';
export * from './crypto';
export * from './session';
export * from './db';

export async function registerUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; signedToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const passwordHash = hashPassword(password);
  const user = await insertUser(normalizedEmail, passwordHash);

  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  await createDbSession(user.id, rawToken, expiresAt);

  const signedToken = signToken(rawToken);
  return { user, signedToken };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; signedToken: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required');
  }

  const dbUser = await findUserByEmail(normalizedEmail);
  if (!dbUser) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = verifyPassword(password, dbUser.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  await createDbSession(dbUser.id, rawToken, expiresAt);

  const signedToken = signToken(rawToken);
  const user: AuthUser = {
    id: dbUser.id,
    email: dbUser.email,
    createdAt: dbUser.created_at.toISOString(),
  };

  return { user, signedToken };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const signedToken = await getAuthSessionCookie();
  if (!signedToken) return null;

  const rawToken = verifySignedToken(signedToken);
  if (!rawToken) return null;

  const sessionData = await findSessionAndUser(rawToken);
  if (!sessionData) return null;

  return sessionData.user;
}

export async function logoutUser(): Promise<void> {
  const signedToken = await getAuthSessionCookie();
  if (signedToken) {
    const rawToken = verifySignedToken(signedToken);
    if (rawToken) {
      await deleteDbSession(rawToken);
    }
  }
  await clearAuthSessionCookie();
}
