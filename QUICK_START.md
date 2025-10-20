# Quick Start - Fix Authentication Issues

## 🚨 Immediate Fix

The authentication was failing because:
1. Email provider requires real SMTP server
2. Missing environment variables
3. Wrong import paths

## ✅ What I Fixed

1. **Switched to Credentials Provider** - No email server needed
2. **Fixed import paths** - Using `@/generated/prisma`
3. **Added SessionProvider** - Required for client-side auth
4. **Created custom signin page** - Easy testing interface

## 🚀 Quick Setup (5 minutes)

### 1. Create Environment File
Create `.env.local` in the `snugbug-app` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/snugbug"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Set up Database
```bash
# Make sure you're in the snugbug-app directory
cd /Users/adrianwildeis/Documents/Work/2025/Snugbug/snugbug-app

# Push schema and generate client
npx prisma db push
npx prisma generate

# Seed with test data
npm run db:seed
```

### 3. Start the Server
```bash
npm run dev
```

## 🧪 Test Authentication

1. **Visit** `http://localhost:3000`
2. **Click** "Sign In" in the header
3. **Use any test email:**
   - `alice@example.com`
   - `bob@example.com` 
   - `carol@example.com`
4. **Password can be anything** (for testing)
5. **Click** "Sign in"

## ✅ What Should Work Now

- ✅ **Homepage** - Shows all 10 listings
- ✅ **Authentication** - Sign in with test emails
- ✅ **Sell Page** - Protected route (redirects to signin if not authenticated)
- ✅ **Session Management** - Stays logged in across pages

## 🔧 If Still Having Issues

1. **Check directory** - Make sure you're in `snugbug-app/`
2. **Database connection** - Verify DATABASE_URL is correct
3. **Environment variables** - Make sure `.env.local` exists
4. **Prisma client** - Run `npx prisma generate` again

## 📧 Test Accounts Available

- **alice@example.com** (Alice Johnson) - 4 listings
- **bob@example.com** (Bob Smith) - 3 listings
- **carol@example.com** (Carol Davis) - 2 listings

All accounts work with any password for testing purposes. 