import Link from 'next/link';
import { signIn } from '@/actions/auth';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo || '/dashboard';
  const errorMessage = params.error;
  const infoMessage = params.message;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              create a new account for free
            </Link>
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-4 border border-red-200 dark:border-red-900">
            <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
        )}

        {infoMessage && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-4 border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-700 dark:text-blue-300">{infoMessage}</p>
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" action={signIn}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="mt-1.5 block w-full min-h-[48px] px-3.5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xs bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="mt-1.5 block w-full min-h-[48px] px-3.5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xs bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full min-h-[48px] flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
