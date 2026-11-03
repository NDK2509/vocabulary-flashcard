import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const dbResult = await query<{ current_database: string; version: string }>(
      'SELECT current_database(), version();'
    );

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        database: dbResult[0]?.current_database,
        postgres: dbResult[0]?.version?.split(' ')?.[1] ?? 'unknown',
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        configured: Boolean(
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'
        ),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error';
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: message,
        },
      },
      { status: 500 }
    );
  }
}

