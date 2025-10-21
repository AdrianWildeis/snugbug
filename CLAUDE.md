# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Snugbug** is a mobile-first marketplace for parents in Geneva/Lausanne to buy and sell used baby items, targeting both locals and expats. The platform uses a 10% commission model with automatic payment release after 7 days.

**Main application location**: `./cursor attempt/snugbug-app/`

### Business Model
- 10% commission on all sales
- 7-day auto-release after purchase
- All transactions via Stripe Connect
- Email verification required
- Pickup encouraged (shipping is seller's responsibility)

## Development Commands

Navigate to the app directory first: `cd "./cursor attempt/snugbug-app"`

- **Development server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Production server**: `npm start`
- **Lint**: `npm run lint`

### Database Commands
- **Generate Prisma client**: `npm run db:generate`
- **Push schema to DB**: `npm run db:push`
- **Create migration**: `npm run db:migrate`
- **Seed database**: `npm run db:seed`
- **Open Prisma Studio**: `npm run db:studio`

## Database & Prisma

### Prisma Client Location
The Prisma client is generated to a custom location: `src/generated/prisma/`. Always import from:
```typescript
import { PrismaClient } from "@/generated/prisma";
```

### Database Schema
Located at `prisma/schema.prisma`. Core models:
- **User**: Authentication, Stripe Connect details, and user profiles
  - Includes `stripeConnectId`, `stripeOnboarded`, `phone`, `location`
- **Listing**: Items for sale with detailed attributes
  - Multiple images (array), condition, category, location, age range, brand, size
  - Status: active, sold, deleted
- **Transaction**: Purchase records with Stripe payment tracking
  - Calculates commission (10%), seller amount, auto-release date
  - Status: pending, completed, refunded
- **Message**: Real-time messaging between users
- **Review**: User ratings (1-5 stars) linked to transactions
- **Account/Session**: NextAuth v5 models for OAuth

### Database Commands
After modifying the schema, regenerate the client:
```bash
npx prisma generate
npx prisma db push
```

To seed the database with test data:
```bash
npm run db:seed
```

The seed file creates test users (alice@example.com, bob@example.com, carol@example.com) and sample listings.

## Authentication

The app uses **NextAuth v5** (beta) with OAuth providers (Google, Facebook) and database sessions via Prisma Adapter.

### Key Auth Files
- **Auth config**: `src/auth.ts` - Main NextAuth configuration with providers
- **API route**: `src/app/api/auth/[...nextauth]/route.ts` - Exports handlers
- **Type definitions**: `src/types/next-auth.d.ts` - Extended session types

### Auth Utilities
Use the `auth()` function from `@/auth` to get the current session in server components:
```typescript
import { auth } from '@/auth';

const session = await auth();
if (!session?.user) {
  // Not authenticated
}
```

### OAuth Providers
- **Google**: Requires `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
- **Facebook**: Requires `AUTH_FACEBOOK_ID` and `AUTH_FACEBOOK_SECRET`

### Session Extensions
The session includes custom user fields:
- `stripeConnectId`: Seller's Stripe Connect account ID
- `stripeOnboarded`: Whether seller completed Stripe onboarding
- `location`: User's city/location
- `phone`: Contact phone number

## Architecture

### Path Aliases
Use `@/` to reference the `src/` directory:
```typescript
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
```

### Application Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth handlers
│   │   ├── listings/      # Listing CRUD
│   │   ├── upload/        # Image upload to Cloudinary
│   │   └── test-*/        # Test endpoints
│   ├── auth/signin/       # Sign-in page
│   ├── sell/              # Create listing page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── CreateListingForm.tsx
│   ├── Providers.tsx      # Client-side providers
│   └── UserProfile.tsx
├── lib/                   # Shared utilities
│   ├── auth.ts           # Auth helpers
│   ├── prisma.ts         # Prisma client singleton
│   └── types.ts          # Shared types
└── generated/prisma/      # Generated Prisma client
```

### Prisma Singleton Pattern
The app uses a singleton pattern for Prisma to prevent connection exhaustion in development (see `src/lib/prisma.ts`). The instance is stored on `globalThis` in non-production environments.

### API Routes
All API routes follow Next.js 15 App Router conventions with named exports (GET, POST, etc.). Key endpoints:
- `/api/auth/[...nextauth]` - Authentication
- `/api/listings` - Listing operations
- `/api/upload` - Image uploads (Cloudinary)

## Required Environment Variables

The application requires these environment variables (create `.env` in the app root):

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Stripe (for payments)
STRIPE_SECRET_KEY="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
```

## Internationalization (i18n)

The app supports **English (en)** and **French (fr)** using next-intl.

### Configuration
- **Middleware**: `src/middleware.ts` - Handles locale routing
- **i18n config**: `src/i18n.ts` - Defines locales and loads messages
- **Translation files**: `messages/en.json` and `messages/fr.json`

### Using Translations
In server components:
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('common');
return <h1>{t('appName')}</h1>; // "Snugbug"
```

### Locale Routing
- Default locale (en): `example.com/browse`
- French: `example.com/fr/browse`

## Constants & Configuration

### Key Constants (`src/lib/constants.ts`)
- **CATEGORIES**: beds, clothing, toys, furniture, strollers, car-seats, feeding, bathing, monitors, books, other
- **CONDITIONS**: new, like-new, good, fair
- **SWISS_CITIES**: Geneva, Lausanne, Montreux, Vevey, Nyon, Morges, Yverdon-les-Bains, Other
- **COMMISSION_RATE**: 0.1 (10%)
- **AUTO_RELEASE_DAYS**: 7
- **MAX_IMAGES_PER_LISTING**: 8
- **CURRENCY**: CHF (Swiss Francs)

## Stripe Connect Implementation

### Seller Onboarding Flow
1. User clicks "Start Selling"
2. Create Stripe Connect Express account
3. Redirect to Stripe onboarding
4. Store `stripeConnectId` when complete
5. Set `stripeOnboarded = true`

### Commission Calculation
```typescript
const COMMISSION_RATE = 0.10; // 10%
const totalAmount = listingPrice;
const commission = totalAmount * COMMISSION_RATE;
const sellerAmount = totalAmount - commission;
```

### Payment Intent with Application Fee
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(totalAmount * 100), // in cents
  currency: 'chf',
  application_fee_amount: Math.round(commission * 100),
  transfer_data: {
    destination: seller.stripeConnectId,
  },
  on_behalf_of: seller.stripeConnectId,
});
```

### Auto-release Logic
- Set `releaseAt = purchase date + 7 days`
- Run daily cron job to check transactions where `releaseAt < now()` and `status = pending`
- Confirm transfer to seller
- Update status to `completed`

## Technology Stack

- **Framework**: Next.js 15.4.1 (App Router, Turbopack)
- **React**: v19.1.0
- **Database**: PostgreSQL via Prisma 6.12
- **Authentication**: NextAuth v5 (beta) with Prisma Adapter
- **Payments**: Stripe 18.3.0 (Connect for marketplace)
- **Image Upload**: Uploadthing 6.13+
- **Real-time Chat**: Pusher or Socket.io
- **i18n**: next-intl 3.15+
- **Forms**: React Hook Form 7.51+ with Zod validation
- **Email**: Nodemailer 6.10.1
- **Styling**: Tailwind CSS v4
- **TypeScript**: v5

## Feature Implementation Priority

### Phase 1 (MVP - Current Focus)
1. ✅ Authentication (NextAuth with Google/Facebook)
2. ✅ Database schema (User, Listing, Transaction, Message, Review)
3. ✅ Internationalization (EN/FR)
4. ⏳ User profiles
5. ⏳ Create/edit/view listings
6. ⏳ Image upload (max 8 images with Uploadthing)
7. ⏳ Search and filter
8. ⏳ Stripe Connect seller onboarding
9. ⏳ Purchase flow with Stripe Checkout
10. ⏳ Basic messaging system

### Phase 2 (Future)
11. Rating system
12. Auto-release payment logic (cron job)
13. Email notifications
14. Social sharing
15. User dashboard (my listings, purchases, sales)

## Design Guidelines

- **Mobile-first**: Bottom navigation, large touch targets (min 44px)
- **Color scheme**: Soft, friendly colors (baby blues, soft pinks, warm neutrals)
- **Image-focused**: Large product images, carousel view
- **Performance**: Image optimization, lazy loading
- **Accessibility**: Alt texts, semantic HTML, ARIA labels
