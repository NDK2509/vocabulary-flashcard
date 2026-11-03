import Link from 'next/link';
import { getUser, signOut } from '@/actions/auth';
import { MobileMenu } from './MobileMenu';

export async function Navbar() {
  const user = await getUser();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-blue-600 dark:text-blue-400 min-h-[44px] flex items-center"
          >
            📚 VocabCards
          </Link>
          <nav className="hidden sm:flex space-x-2 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/flashcards"
                  className="px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Flashcards
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center space-x-3 text-sm">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline truncate max-w-[200px]">
                {user.email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 active:scale-[0.98] transition cursor-pointer"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="min-h-[40px] flex items-center px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="min-h-[40px] flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden">
          <MobileMenu userEmail={user?.email} isAuthenticated={!!user} />
        </div>
      </div>
    </header>
  );
}
