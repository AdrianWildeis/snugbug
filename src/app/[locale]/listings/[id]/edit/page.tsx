import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { EditListingForm } from '@/components/listings/EditListingForm';

interface EditListingPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    notFound();
  }

  // Check if user owns this listing
  if (listing.userId !== session.user.id) {
    redirect('/');
  }

  // Convert Decimal to number for client compatibility
  const listingWithNumber = {
    ...listing,
    price: Number(listing.price),
  };

  const t = await getTranslations('listing');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('editListing')}
          </h1>
          <p className="text-gray-600">
            Update your listing information
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <EditListingForm listing={listingWithNumber} isAdmin={session.user.isAdmin || false} />
        </div>
      </div>
    </div>
  );
}
