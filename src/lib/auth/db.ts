import { query } from '@/lib/db';
import { AuthUser, DbUser, DbSession } from './types';

export async function ensureAuthSchema(): Promise<void> {
  const sql = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS public.users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(lower(email));

    CREATE TABLE IF NOT EXISTS public.sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token VARCHAR(255) UNIQUE NOT NULL,
      user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(token);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
  `;
  await query(sql);
}

export async function findUserByEmail(email: string): Promise<DbUser | null> {
  const rows = await query<DbUser>(
    'SELECT id, email, password_hash, created_at, updated_at FROM public.users WHERE lower(email) = lower($1) LIMIT 1;',
    [email.trim()]
  );
  return rows[0] || null;
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const rows = await query<{ id: string; email: string; created_at: Date }>(
    'SELECT id, email, created_at FROM public.users WHERE id = $1 LIMIT 1;',
    [id]
  );
  if (!rows[0]) return null;
  return {
    id: rows[0].id,
    email: rows[0].email,
    createdAt: rows[0].created_at.toISOString(),
  };
}

export async function insertUser(email: string, passwordHash: string): Promise<AuthUser> {
  const rows = await query<{ id: string; email: string; created_at: Date }>(
    'INSERT INTO public.users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at;',
    [email.trim().toLowerCase(), passwordHash]
  );
  const created = rows[0];
  return {
    id: created.id,
    email: created.email,
    createdAt: created.created_at.toISOString(),
  };
}

export async function createDbSession(userId: string, token: string, expiresAt: Date): Promise<void> {
  await query(
    'INSERT INTO public.sessions (token, user_id, expires_at) VALUES ($1, $2, $3);',
    [token, userId, expiresAt]
  );
}

export async function findSessionAndUser(
  token: string
): Promise<{ session: DbSession; user: AuthUser } | null> {
  const sql = `
    SELECT 
      s.id as session_id,
      s.token,
      s.user_id,
      s.expires_at,
      s.created_at as session_created_at,
      u.id as user_id,
      u.email,
      u.created_at as user_created_at
    FROM public.sessions s
    JOIN public.users u ON s.user_id = u.id
    WHERE s.token = $1 AND s.expires_at > NOW()
    LIMIT 1;
  `;
  const rows = await query<{
    session_id: string;
    token: string;
    user_id: string;
    expires_at: Date;
    session_created_at: Date;
    email: string;
    user_created_at: Date;
  }>(sql, [token]);

  if (!rows[0]) return null;
  const row = rows[0];

  return {
    session: {
      id: row.session_id,
      token: row.token,
      user_id: row.user_id,
      expires_at: row.expires_at,
      created_at: row.session_created_at,
    },
    user: {
      id: row.user_id,
      email: row.email,
      createdAt: row.user_created_at.toISOString(),
    },
  };
}

export async function deleteDbSession(token: string): Promise<void> {
  await query('DELETE FROM public.sessions WHERE token = $1;', [token]);
}

