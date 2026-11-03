import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/dashboard');
  }

  // Example backend database call
  let dbStatus = 'Connected';
  try {
    await query('SELECT 1;');
  } catch {
    dbStatus = 'Unavailable';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Welcome back, {user.email}! Here is your vocabulary learning overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Auth Status</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            Authenticated
          </div>
          <div className="mt-1 text-xs text-gray-400 truncate">User ID: {user.id}</div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Database Pool</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {dbStatus}
          </div>
          <div className="mt-1 text-xs text-gray-400">Supabase PostgreSQL 17</div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Flashcards Due</div>
          <div className="mt-2 text-2xl font-semibold">12 cards</div>
          <div className="mt-1 text-xs text-gray-400">Spaced repetition schedule</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/flashcards"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
          >
            Start Flashcard Review
          </Link>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition"
          >
            Inspect Backend API Health (/api/health)
          </a>
        </div>
      </div>
    </div>
  );
}
