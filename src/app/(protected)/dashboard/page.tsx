import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/actions/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getUser();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words">
          Welcome back, <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span>! Here is your vocabulary learning overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Auth Status</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            Authenticated
          </div>
          <div className="mt-1 text-xs text-gray-400 truncate">User ID: {user.id}</div>
        </div>

        <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Database Pool</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {dbStatus}
          </div>
          <div className="mt-1 text-xs text-gray-400">PostgreSQL 17 direct pool</div>
        </div>

        <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs sm:col-span-2 md:col-span-1">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Flashcards Due</div>
          <div className="mt-2 text-2xl font-semibold">12 cards</div>
          <div className="mt-1 text-xs text-gray-400">Spaced repetition schedule</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/flashcards"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition active:scale-[0.98] shadow-sm"
          >
            Start Flashcard Review
          </Link>
          <a
            href="/api/auth/me"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition active:scale-[0.98]"
          >
            Inspect Current Session (/api/auth/me)
          </a>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl transition active:scale-[0.98]"
          >
            Backend Health (/api/health)
          </a>
        </div>
      </div>
    </div>
  );
}
