'use client';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export function SignOutButton() {
  const t = useTranslations('nav');

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      {t('signOut')}
    </button>
  );
}
