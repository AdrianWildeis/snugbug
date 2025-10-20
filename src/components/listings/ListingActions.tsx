'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ContactSellerButton } from './ContactSellerButton';

interface ListingActionsProps {
  listingId: string;
  isOwner: boolean;
  isSignedIn: boolean;
}

export function ListingActions({ listingId, isOwner, isSignedIn }: ListingActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const t = useTranslations('listing');
  const tCommon = useTranslations('common');

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete listing. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isOwner) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center mb-3">
          {t('yourListing')}
        </p>
        <Link
          href={`/listings/${listingId}/edit`}
          className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-700 transition-colors"
        >
          {tCommon('edit')}
        </Link>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            {tCommon('delete')}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600 text-center font-medium">
              Are you sure you want to delete this listing?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ContactSellerButton listingId={listingId} isSignedIn={isSignedIn} />
    </div>
  );
}
