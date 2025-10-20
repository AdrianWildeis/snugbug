import { z } from 'zod';
import { CATEGORIES, CONDITIONS, SWISS_CITIES, AGE_RANGES } from '@/lib/constants';

export const listingSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  price: z
    .number()
    .min(1, 'Price must be at least 1 CHF')
    .max(10000, 'Price must be less than 10,000 CHF'),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  condition: z.enum(CONDITIONS, {
    errorMap: () => ({ message: 'Please select a valid condition' }),
  }),
  location: z.enum(SWISS_CITIES, {
    errorMap: () => ({ message: 'Please select a valid location' }),
  }),
  ageRange: z
    .enum([...AGE_RANGES, ''] as [string, ...string[]])
    .optional()
    .nullable(),
  brand: z.string().max(50, 'Brand must be less than 50 characters').optional().nullable(),
  size: z.string().max(30, 'Size must be less than 30 characters').optional().nullable(),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'Please upload at least 1 image')
    .max(8, 'Maximum 8 images allowed'),
});

export type ListingFormData = z.infer<typeof listingSchema>;
