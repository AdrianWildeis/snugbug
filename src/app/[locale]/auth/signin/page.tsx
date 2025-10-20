import { getTranslations } from 'next-intl/server';
import { SignInForm } from '@/components/auth/SignInForm';

export default async function SignInPage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen bg-brand-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Snugbug</h1>
          <p className="text-gray-600">{t('signIn')}</p>
        </div>

        {/* Sign In Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <SignInForm />
        </div>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Development Mode: Use test emails
          </p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div>• alice@example.com</div>
            <div>• bob@example.com</div>
            <div>• carol@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
