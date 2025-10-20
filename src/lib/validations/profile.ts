import { z } from 'zod';
import { SWISS_CITIES } from '@/lib/constants';

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(
      /^(\+41|0041|0)?[1-9]\d{1,2}\s?\d{3}\s?\d{2}\s?\d{2}$/,
      'Please enter a valid Swiss phone number'
    )
    .optional()
    .nullable()
    .or(z.literal('')),
  location: z
    .enum([...SWISS_CITIES] as [string, ...string[]])
    .optional()
    .nullable(),
  image: z.string().url('Invalid image URL').optional().nullable(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
