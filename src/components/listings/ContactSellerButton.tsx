'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ContactSellerButtonProps {
  listingId: string;
  isSignedIn: boolean;
}

export function ContactSellerButton({ listingId, isSignedIn }: ContactSellerButtonProps) {
  const t = useTranslations('listing');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleContactSeller = async () => {
    if (!isSignedIn) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);

    try {
      // Create or get conversation
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start conversation');
      }

      const conversation = await response.json();
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      if (error instanceof Error && error.message === 'Cannot message yourself') {
        alert('You cannot message yourself about your own listing.');
      } else {
        alert('Failed to start conversation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleContactSeller}
      disabled={loading}
      className="w-full bg-brand-teal-700 text-white px-6 py-3 rounded-lg hover:bg-brand-teal-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? '...' : isSignedIn ? t('contactSeller') : t('toContact')}
    </button>
  );
}
