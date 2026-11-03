import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Next.js App Router + Supabase Auth
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
          Master New Words with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Intelligent Flashcards
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
          A full-stack application built with Next.js 16 (App Router + Server Actions), Supabase SSR
          Authentication, and PostgreSQL database storage.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/flashcards"
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition"
              >
                Study Flashcards
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Technical stack overview */}
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <div className="text-2xl">🔒</div>
            <h3 className="font-bold text-base">Supabase SSR Auth</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cookie-based session synchronization across Next.js Server Components, Server
              Actions, and Client Components via <code className="text-blue-500">@supabase/ssr</code>.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <div className="text-2xl">🛡️</div>
            <h3 className="font-bold text-base">Protected Routes</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Edge middleware guarding <code className="text-blue-500">/dashboard</code> and{' '}
              <code className="text-blue-500">/flashcards</code> with token validation via{' '}
              <code className="text-blue-500">getUser()</code>.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <div className="text-2xl">⚡</div>
            <h3 className="font-bold text-base">Full-Stack Architecture</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Direct connection pooling to Supabase PostgreSQL 17 plus REST Route Handlers in{' '}
              <code className="text-blue-500">src/app/api/*</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
