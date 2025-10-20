// Categories for baby items
export const CATEGORIES = [
  'beds',
  'clothing',
  'toys',
  'furniture',
  'strollers',
  'car-seats',
  'feeding',
  'bathing',
  'monitors',
  'books',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

// Condition options
export const CONDITIONS = ['new', 'like-new', 'good', 'fair'] as const;

export type Condition = (typeof CONDITIONS)[number];

// Swiss cities in Geneva/Lausanne region
export const SWISS_CITIES = [
  'Geneva',
  'Lausanne',
  'Montreux',
  'Vevey',
  'Nyon',
  'Morges',
  'Yverdon-les-Bains',
  'Other',
] as const;

export type SwissCity = (typeof SWISS_CITIES)[number];

// Age ranges for baby items
export const AGE_RANGES = [
  '0-6 months',
  '6-12 months',
  '1-2 years',
  '2-3 years',
  '3+ years',
] as const;

export type AgeRange = (typeof AGE_RANGES)[number];

// Listing status
export const LISTING_STATUS = ['active', 'sold', 'deleted'] as const;

export type ListingStatus = (typeof LISTING_STATUS)[number];

// Transaction status
export const TRANSACTION_STATUS = ['pending', 'completed', 'refunded'] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUS)[number];

// Commission rate (10%)
export const COMMISSION_RATE = 0.1;

// Auto-release days after purchase
export const AUTO_RELEASE_DAYS = 7;

// Maximum images per listing
export const MAX_IMAGES_PER_LISTING = 8;

// Currency
export const CURRENCY = 'CHF';
export const STRIPE_CURRENCY = 'chf';
