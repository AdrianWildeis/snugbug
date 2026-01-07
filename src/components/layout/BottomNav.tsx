'use client';

import { Link } from '@/routing';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BottomNavProps {
  isAuthenticated: boolean;
}

export function BottomNav({ isAuthenticated }: BottomNavProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const isActive = (path: string) => {
    // Remove locale prefix for comparison
    const cleanPathname = pathname.replace(/^\/(en|fr)/, '') || '/';
    return cleanPathname === path || cleanPathname.startsWith(path + '/');
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {/* Browse */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive('/') && !isActive('/sell') && !isActive('/messages') && !isActive('/profile')
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1">{t('browse')}</span>
        </Link>

        {isAuthenticated && (
          <>
            {/* Sell */}
            <Link
              href="/sell"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/sell')
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xs mt-1">{t('sell')}</span>
            </Link>

            {/* Messages */}
            <Link
              href="/messages"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/messages')
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="text-xs mt-1">{t('messages')}</span>
            </Link>

            {/* Profile */}
            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive('/profile')
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-xs mt-1">{t('profile')}</span>
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/signin"
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-xs mt-1">{t('signIn')}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
