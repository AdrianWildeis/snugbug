'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { listingSchema, type ListingFormData } from '@/lib/validations/listing';
import { CATEGORIES, CONDITIONS, SWISS_CITIES, AGE_RANGES } from '@/lib/constants';

interface CreateListingFormProps {
  isAdmin?: boolean;
}

export function CreateListingForm({ isAdmin = false }: CreateListingFormProps) {
  const [images, setImages] = useState<string[]>([]);
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
  });

  const onSubmit = async (data: ListingFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
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
        throw new Error(errorData.error || 'Failed to create listing');
      }

      const listing = await response.json();
      router.push(`/listings/${listing.id}`);
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Premium Baby Stroller - Lightweight & Foldable"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Describe your item in detail... (min 20 characters)"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="120.00"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Bugaboo"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="0-3 months, 74cm, etc."
        />
      </div>

      {/* Admin-Only Fields */}
      {isAdmin && (
        <div className="space-y-6 p-6 bg-amber-50 border-2 border-amber-300 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-amber-900 uppercase tracking-wide">
              Admin-Only Fields
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Number */}
            <div>
              <label htmlFor="adminNumber" className="block text-sm font-medium text-amber-900 mb-2">
                Number
              </label>
              <input
                id="adminNumber"
                type="text"
                {...register('adminNumber')}
                className="w-full px-4 py-3 border-2 border-amber-300 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Reference number..."
              />
            </div>

            {/* Admin Place */}
            <div>
              <label htmlFor="adminPlace" className="block text-sm font-medium text-amber-900 mb-2">
                Place
              </label>
              <input
                id="adminPlace"
                type="text"
                {...register('adminPlace')}
                className="w-full px-4 py-3 border-2 border-amber-300 bg-white rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Storage location..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('images')} * (Max 8)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Take photos with your camera or upload from your device
        </p>

        {/* File Input with Camera Support */}
        {images.length < 8 && (
          <div className="mb-4">
            <label
              htmlFor="imageUpload"
              className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors bg-gray-50"
            >
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  📷 Take Photo or Upload Image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, HEIC up to 10MB
                </p>
              </div>
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && images.length < 8) {
                  // Validate file size (10MB)
                  if (file.size > 10 * 1024 * 1024) {
                    setError('Image must be less than 10MB');
                    return;
                  }

                  // Convert to base64 for preview and storage
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    const newImages = [...images, base64String];
                    setImages(newImages);
                    setValue('images', newImages);
                    setError(null);
                  };
                  reader.onerror = () => {
                    setError('Failed to read image file');
                  };
                  reader.readAsDataURL(file);
                }
                // Reset input to allow selecting the same file again
                e.target.value = '';
              }}
            />
          </div>
        )}

        {/* Uploaded Images Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = images.filter((_, i) => i !== index);
                    setImages(newImages);
                    setValue('images', newImages);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Remove image"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {index + 1} / {images.length}
                </div>
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
          {isLoading ? tCommon('loading') : t('createListing')}
        </button>
      </div>
    </form>
  );
}
