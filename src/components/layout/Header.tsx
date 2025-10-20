import { auth } from '@/auth';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Link } from '@/routing';
import { getTranslations } from 'next-intl/server';

export async function Header() {
  const session = await auth();
  const t = await getTranslations('nav');

  return (
    <header className="shadow-sm border-b border-brand-teal-300 sticky top-0 z-50" style={{backgroundColor: '#e1eee7'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/snugbug-logo.png"
              alt="Snugbug"
              className="w-16 h-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-brand-teal-700">Snugbug</h1>
              <p className="text-xs text-brand-teal-500">Baby Marketplace</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              {t('browse')}
            </Link>
            {session && (
              <>
                <Link href="/sell" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('sell')}
                </Link>
                <Link href="/messages" className="text-gray-600 hover:text-gray-900 transition-colors">
                  {t('messages')}
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Profile'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="hidden sm:block font-medium">
                    {session.user?.name || session.user?.email}
                  </span>
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
