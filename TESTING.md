# Testing Guide for Snugbug

## 🚀 Quick Start

### 1. Set up Environment Variables
Create a `.env.local` file in the `snugbug-app` directory:

```env
# Database (use a local PostgreSQL or cloud database)
DATABASE_URL="postgresql://username:password@localhost:5432/snugbug"

# NextAuth (generate a random secret)
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for testing - you can use a test SMTP service)
EMAIL_SERVER="smtp://test:test@localhost:1025"
EMAIL_FROM="test@snugbug.com"

# Cloudinary (sign up at cloudinary.com for free)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 2. Set up Database
```bash
# Push the schema to your database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Seed the database with mock data
npm run db:seed
```

### 3. Start the Development Server
```bash
npm run dev
```

## 📊 Mock Data Created

### Test Users
- **alice@example.com** (Alice Johnson) - Has 4 listings
- **bob@example.com** (Bob Smith) - Has 3 listings  
- **carol@example.com** (Carol Davis) - Has 2 listings

### Sample Listings (10 total)
1. **Premium Baby Stroller** - $120.00 (Transportation)
2. **Solid Wood Baby Crib** - $200.00 (Furniture)
3. **Adjustable High Chair** - $80.00 (Furniture)
4. **Video Baby Monitor** - $50.00 (Electronics)
5. **Infant Car Seat** - $150.00 (Transportation)
6. **Organic Cotton Onesies Set** - $25.00 (Clothing)
7. **Educational Wooden Toys** - $35.00 (Toys)
8. **Baby Bath Tub** - $30.00 (Bath & Care)
9. **Breast Pump** - $180.00 (Feeding)
10. **Baby Books Collection** - $15.00 (Books)

### Sample Orders
- Carol bought the Premium Baby Stroller from Alice
- Carol bought the Adjustable High Chair from Bob

## 🧪 Testing Scenarios

### 1. View Homepage
- Visit `http://localhost:3000`
- You should see all 10 listings displayed in a grid
- Each listing shows: image, title, price, description, category, and seller

### 2. Test Authentication
- Click "Sign In" in the header
- You'll be redirected to NextAuth signin page
- Use any of the test emails to sign in

### 3. Test Sell Page
- Click "Sell Item" button (requires authentication)
- If not logged in, you'll be redirected to signin
- Once logged in, you can create new listings

### 4. Test Image Upload
- On the sell page, try uploading an image
- Images will be uploaded to Cloudinary (if configured)
- You'll see a preview of the uploaded image

### 5. Test API Endpoints
- `GET /api/listings` - Returns all listings
- `GET /api/listings?category=Toys` - Filter by category
- `POST /api/listings` - Create new listing (requires auth)
- `POST /api/upload` - Upload images to Cloudinary

## 🔧 Troubleshooting

### Database Connection Issues
- Make sure your PostgreSQL database is running
- Check your DATABASE_URL format
- Run `npx prisma db push` to sync schema

### NextAuth Issues
- Generate a proper NEXTAUTH_SECRET (use `openssl rand -base64 32`)
- Make sure NEXTAUTH_URL matches your dev server URL

### Cloudinary Issues
- Sign up for a free Cloudinary account
- Get your credentials from the dashboard
- Images will use placeholder URLs if not configured

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Check that the generated client path is correct

## 📱 Features to Test

- ✅ **Homepage** - Displays all listings
- ✅ **Authentication** - Sign in/out functionality  
- ✅ **Sell Page** - Create new listings (protected)
- ✅ **Image Upload** - Upload to Cloudinary
- ✅ **Form Validation** - Client and server-side validation
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Database Integration** - All data stored in PostgreSQL
- ✅ **API Endpoints** - RESTful API for listings

## 🎯 Next Steps

1. **Add more features** like search, filtering, user profiles
2. **Implement Stripe** for payment processing
3. **Add real images** instead of placeholders
4. **Create listing detail pages** for individual items
5. **Add messaging** between buyers and sellers 