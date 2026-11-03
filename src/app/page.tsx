import Link from 'next/link';
import { getUser } from '@/actions/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const user = await getUser();

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full">
      <div className="max-w-4xl w-full text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Next.js App Router + Custom Auth API
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-none">
          Master New Words with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Intelligent Flashcards
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300">
          A full-stack application built with Next.js 16 (App Router + Server Actions), custom
          PostgreSQL-backed Authentication API, and PostgreSQL database storage.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm active:scale-[0.98] transition"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/flashcards"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold active:scale-[0.98] transition"
              >
                Study Flashcards
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm active:scale-[0.98] transition"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto min-h-[48px] flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold active:scale-[0.98] transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Technical stack overview */}
        <div className="pt-8 sm:pt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
            <div className="text-2xl">🔒</div>
            <h3 className="font-bold text-base">Custom Auth API</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Direct REST endpoints (`/api/auth/*`) and Server Actions with scrypt password hashing
              and secure HttpOnly session cookies.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
            <div className="text-2xl">🛡️</div>
            <h3 className="font-bold text-base">Protected Routes</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Edge middleware guarding <code className="text-blue-500">/dashboard</code> and{' '}
              <code className="text-blue-500">/flashcards</code> with cryptographic session validation.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-2">
            <div className="text-2xl">⚡</div>
            <h3 className="font-bold text-base">PostgreSQL 17 Storage</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dedicated <code className="text-blue-500">users</code> and{' '}
              <code className="text-blue-500">sessions</code> relational tables pooled via{' '}
              <code className="text-blue-500">pg</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
