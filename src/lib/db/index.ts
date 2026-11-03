import { Pool } from 'pg';

// Global singleton pool for Next.js hot reload in development
const globalForDb = globalThis as unknown as {
  dbPool?: Pool;
};

export const pool =
  globalForDb.dbPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres.yegdyjrcafqxlxhfmzzf:vocabulary-flashcard@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows as T[];
  } finally {
    client.release();
  }
}

