'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut } from '@/actions/auth';

export interface MobileMenuProps {
  userEmail?: string | null;
  isAuthenticated: boolean;
}

export function MobileMenu({ userEmail, isAuthenticated }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div>
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-menu"
        className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.96] transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="absolute left-0 right-0 top-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-xl px-4 py-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition"
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/flashcards"
                  onClick={closeMenu}
                  className="flex items-center min-h-[44px] px-3 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition"
                >
                  Flashcards
                </Link>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  {userEmail && (
                    <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                      Signed in as <span className="font-semibold text-gray-700 dark:text-gray-300">{userEmail}</span>
                    </div>
                  )}
                  <form action={signOut} className="w-full">
                    <button
                      type="submit"
                      onClick={closeMenu}
                      className="w-full min-h-[44px] flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 active:scale-[0.98] transition"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition border border-gray-200 dark:border-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex items-center justify-center min-h-[48px] px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] transition shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

