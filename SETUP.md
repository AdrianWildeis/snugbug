# Sell Page Setup Guide

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/snugbug"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email (for NextAuth email provider)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@snugbug.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Cloudinary Setup

1. Sign up for a free Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret from your dashboard
3. Add them to your environment variables

## Database Setup

1. Run the database migration:
   ```bash
   npx prisma db push
   ```

2. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Features

The `/sell` page includes:

- ✅ Authentication check (redirects to signin if not logged in)
- ✅ Form with title, description, price, and category fields
- ✅ Image upload to Cloudinary
- ✅ Form validation
- ✅ Database integration with Prisma
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling

## Usage

1. Navigate to `/sell` when logged in
2. Fill out the form with your item details
3. Upload an image (automatically uploaded to Cloudinary)
4. Submit to create your listing
5. You'll be redirected to the listing page

## API Endpoints

- `POST /api/upload` - Upload images to Cloudinary
- `POST /api/listings` - Create new listings
- `GET /api/listings` - Fetch listings with pagination and filtering 