import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CreateListingForm } from '@/components/listings/CreateListingForm';

export default async function SellPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const t = await getTranslations('listing');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('createListing')}
          </h1>
          <p className="text-gray-600">
            {t('createListingDescription')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <CreateListingForm />
        </div>
      </div>
    </div>
  );
}
