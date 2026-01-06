import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ListingActions } from '@/components/listings/ListingActions';

interface ListingDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const session = await auth();
  const t = await getTranslations('listing');
  const tCommon = await getTranslations('common');
  const tCategories = await getTranslations('categories');
  const tConditions = await getTranslations('conditions');

  // Fetch listing with user details
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          location: true,
          createdAt: true,
          _count: {
            select: {
              listings: true,
              reviewsReceived: true,
            },
          },
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  // Convert Decimal to number for client compatibility
  const listingWithNumber = {
    ...listing,
    price: Number(listing.price),
  };

  // Increment view count (but not for the owner)
  if (session?.user?.id !== listingWithNumber.userId) {
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  const isOwner = session?.user?.id === listingWithNumber.userId;
  const priceFormatted = new Intl.NumberFormat('en-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(Number(listingWithNumber.price));

  return (
    <div className="min-h-screen bg-brand-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {listingWithNumber.images.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 p-4">
                  {/* Main Image */}
                  <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={listingWithNumber.images[0]}
                      alt={listingWithNumber.title}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Thumbnail Grid */}
                  {listingWithNumber.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {listingWithNumber.images.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <Image
                            src={image}
                            alt={`${listingWithNumber.title} ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-100">
                  <p className="text-gray-400">{t('noImages')}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {listingWithNumber.title}
                </h1>
                <p className="text-4xl font-bold text-primary-600">{priceFormatted}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">{t('category')}</p>
                  <p className="font-medium text-gray-900">
                    {tCategories(listingWithNumber.category)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('condition')}</p>
                  <p className="font-medium text-gray-900">
                    {tConditions(listingWithNumber.condition)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('location')}</p>
                  <p className="font-medium text-gray-900">{listingWithNumber.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('views')}</p>
                  <p className="font-medium text-gray-900">{listingWithNumber.views}</p>
                </div>
                {listingWithNumber.ageRange && (
                  <div>
                    <p className="text-sm text-gray-500">{t('ageRange')}</p>
                    <p className="font-medium text-gray-900">{listingWithNumber.ageRange}</p>
                  </div>
                )}
                {listingWithNumber.brand && (
                  <div>
                    <p className="text-sm text-gray-500">{t('brand')}</p>
                    <p className="font-medium text-gray-900">{listingWithNumber.brand}</p>
                  </div>
                )}
                {listingWithNumber.size && (
                  <div>
                    <p className="text-sm text-gray-500">{t('size')}</p>
                    <p className="font-medium text-gray-900">{listingWithNumber.size}</p>
                  </div>
                )}
              </div>

              {/* Admin-Only Fields */}
              {session?.user?.isAdmin && (listingWithNumber.adminNumber || listingWithNumber.adminPlace) && (
                <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                      Admin Info
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {listingWithNumber.adminNumber && (
                      <div>
                        <p className="text-xs text-amber-700 font-medium">Number</p>
                        <p className="font-semibold text-amber-900">{listingWithNumber.adminNumber}</p>
                      </div>
                    )}
                    {listingWithNumber.adminPlace && (
                      <div>
                        <p className="text-xs text-amber-700 font-medium">Place</p>
                        <p className="font-semibold text-amber-900">{listingWithNumber.adminPlace}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('description')}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {listingWithNumber.description}
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {t('posted')}: {new Date(listingWithNumber.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Sidebar - Seller Info & Actions */}
          <div className="space-y-6">
            {/* Seller Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('seller')}
              </h3>

              <div className="flex items-start space-x-4 mb-4">
                {listingWithNumber.user.image ? (
                  <Image
                    src={listingWithNumber.user.image}
                    alt={listingWithNumber.user.name || 'User'}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-500">
                      {listingWithNumber.user.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {listingWithNumber.user.name || 'Anonymous'}
                  </p>
                  {listingWithNumber.user.location && (
                    <p className="text-sm text-gray-600">{listingWithNumber.user.location}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {t('memberSince')}: {new Date(listingWithNumber.user.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    <span>{listingWithNumber.user._count.listings} {t('listings')}</span>
                    <span>{listingWithNumber.user._count.reviewsReceived} {t('reviews')}</span>
                  </div>
                </div>
              </div>

              <ListingActions
                listingId={listingWithNumber.id}
                isOwner={isOwner}
                isSignedIn={!!session?.user?.id}
              />
            </div>

            {/* Safety Tips */}
            <div className="bg-brand-mint-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('safetyTips')}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t('safetyTip1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t('safetyTip2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{t('safetyTip3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
