import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/auth';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const t = await getTranslations('profile');

  // Fetch user profile data directly from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      location: true,
      stripeConnectId: true,
      stripeOnboarded: true,
      createdAt: true,
      _count: {
        select: {
          listings: true,
          purchases: true,
          sales: true,
          reviewsReceived: true,
        },
      },
    },
  });

  // Calculate average rating
  const reviews = await prisma.review.findMany({
    where: { reviewedId: session.user.id },
    select: { rating: true },
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const profileData = user ? {
    ...user,
    stats: {
      listingsCount: user._count.listings,
      purchasesCount: user._count.purchases,
      salesCount: user._count.sales,
      reviewsCount: user._count.reviewsReceived,
      averageRating: Math.round(averageRating * 10) / 10,
    },
  } : null;

  return (
    <div className="min-h-screen bg-brand-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'Profile'}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user.name || session.user.email}
              </h1>
              <p className="text-gray-600">{session.user.email}</p>
              {profileData?.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  {t('memberSince')}{' '}
                  {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          {profileData?.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {profileData.stats.listingsCount}
                </div>
                <div className="text-sm text-gray-600">{t('activeListings')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {profileData.stats.salesCount}
                </div>
                <div className="text-sm text-gray-600">{t('totalSales')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profileData.stats.purchasesCount}
                </div>
                <div className="text-sm text-gray-600">{t('totalPurchases')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {profileData.stats.averageRating || 'N/A'}
                  {profileData.stats.averageRating > 0 && '★'}
                </div>
                <div className="text-sm text-gray-600">
                  {t('rating')} ({profileData.stats.reviewsCount})
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stripe Connect Status */}
        {!session.user.stripeOnboarded && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-900 mb-2">
              Want to start selling?
            </h3>
            <p className="text-sm text-yellow-800 mb-3">
              Connect your Stripe account to receive payments for your sales.
            </p>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
              Connect Stripe Account
            </button>
          </div>
        )}

        {/* Edit Profile Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('editProfile')}
          </h2>
          <EditProfileForm
            initialData={{
              name: session.user.name,
              phone: session.user.phone,
              location: session.user.location,
              image: session.user.image,
            }}
          />
        </div>
      </div>
    </div>
  );
}
