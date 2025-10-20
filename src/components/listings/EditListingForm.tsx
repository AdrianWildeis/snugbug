'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { listingSchema, type ListingFormData } from '@/lib/validations/listing';
import { CATEGORIES, CONDITIONS, SWISS_CITIES, AGE_RANGES } from '@/lib/constants';
import type { Listing } from '@/generated/prisma';

interface EditListingFormProps {
  listing: Listing;
}

export function EditListingForm({ listing }: EditListingFormProps) {
  const [images, setImages] = useState<string[]>(listing.images);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations('listing');
  const tCommon = useTranslations('common');
  const tCategories = useTranslations('categories');
  const tConditions = useTranslations('conditions');
  const tLocations = useTranslations('locations');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      category: listing.category,
      condition: listing.condition,
      location: listing.location,
      ageRange: listing.ageRange || '',
      brand: listing.brand || '',
      size: listing.size || '',
      images: listing.images,
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update listing');
      }

      router.push(`/listings/${listing.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          {t('title')} *
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          {t('description')} *
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Price, Category, Condition - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            {t('price')} (CHF) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            {t('category')} *
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{tCommon('select')}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {tCategories(cat)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
            {t('condition')} *
          </label>
          <select
            id="condition"
            {...register('condition')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{tCommon('select')}</option>
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {tConditions(cond)}
              </option>
            ))}
          </select>
          {errors.condition && (
            <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
          )}
        </div>
      </div>

      {/* Location, Age Range, Brand - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            {t('location')} *
          </label>
          <select
            id="location"
            {...register('location')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{tCommon('select')}</option>
            {SWISS_CITIES.map((city) => (
              <option key={city} value={city}>
                {tLocations(city)}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Age Range */}
        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
            {t('ageRange')}
          </label>
          <select
            id="ageRange"
            {...register('ageRange')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">{tCommon('select')}</option>
            {AGE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
            {t('brand')}
          </label>
          <input
            id="brand"
            type="text"
            {...register('brand')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
          {t('size')}
        </label>
        <input
          id="size"
          type="text"
          {...register('size')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Image URLs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('images')} * (Max 8)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          For development: Enter image URLs from Unsplash or other sources
        </p>

        {/* Image URL Input */}
        {images.length < 8 && (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const url = input.value.trim();
                    if (url && images.length < 8) {
                      try {
                        new URL(url);
                        const newImages = [...images, url];
                        setImages(newImages);
                        setValue('images', newImages);
                        input.value = '';
                        setError(null);
                      } catch {
                        setError('Please enter a valid URL');
                      }
                    }
                  }
                }}
                id="imageUrlInput"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                  const url = input.value.trim();
                  if (url && images.length < 8) {
                    try {
                      new URL(url);
                      const newImages = [...images, url];
                      setImages(newImages);
                      setValue('images', newImages);
                      input.value = '';
                      setError(null);
                    } catch {
                      setError('Please enter a valid URL');
                    }
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = images.filter((_, i) => i !== index);
                    setImages(newImages);
                    setValue('images', newImages);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && (
          <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          {tCommon('cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading || images.length === 0}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? tCommon('loading') : tCommon('save')}
        </button>
      </div>
    </form>
  );
}
