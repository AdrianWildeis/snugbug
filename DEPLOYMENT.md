# Deployment Guide

This guide covers deploying Snugbug to production using Vercel (frontend/Next.js) and Railway (PostgreSQL database).

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (connected to GitHub)
- Railway account
- Uploadthing account configured
- Google OAuth credentials (production)
- Stripe account (production keys)

## 1. Database Setup (Railway)

### Create PostgreSQL Database

1. Go to [Railway.app](https://railway.app)
2. Click **New Project** → **Provision PostgreSQL**
3. Once created, click on the PostgreSQL service
4. Go to **Variables** tab
5. Copy the `DATABASE_URL` value (starts with `postgresql://`)

### Configure Database

The `DATABASE_URL` will be in this format:
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

You'll use this in your Vercel environment variables.

## 2. Vercel Deployment

### Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository: `your-username/snugbug`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `.` (or leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

#### Database
```bash
DATABASE_URL="postgresql://..." # From Railway
```

#### Authentication (NextAuth v5)
```bash
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="https://your-app.vercel.app"

# Google OAuth (Production)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-secret"

# Facebook OAuth (Optional)
AUTH_FACEBOOK_ID=""
AUTH_FACEBOOK_SECRET=""
```

**Generate AUTH_SECRET**:
```bash
openssl rand -base64 32
```

#### Uploadthing
```bash
UPLOADTHING_SECRET="sk_live_..."  # From uploadthing.com
UPLOADTHING_APP_ID="your-app-id"
```

#### Stripe
```bash
STRIPE_SECRET_KEY="sk_live_..."  # Production key from Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  # Create webhook endpoint first
```

#### Optional: Pusher (Real-time Chat)
```bash
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER="eu"
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER="eu"
```

#### Optional: Email (SMTP)
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"
SMTP_FROM="noreply@snugbug.ch"
```

#### Application
```bash
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

### Deploy

1. Click **Deploy**
2. Vercel will build and deploy automatically
3. Once deployed, note your production URL

## 3. Post-Deployment Configuration

### Database Migration

After first deployment, you need to push the Prisma schema to your production database:

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull

# Run Prisma migrations
npx prisma db push
```

**Option B: Using Railway CLI**
```bash
# Connect to Railway database
DATABASE_URL="postgresql://..." npx prisma db push
```

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Edit your OAuth 2.0 Client ID
5. Add Authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Add Authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```

### Stripe Webhook Configuration

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter endpoint URL:
   ```
   https://your-app.vercel.app/api/webhooks/stripe
   ```
5. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated` (for Connect)
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### Uploadthing Configuration

1. Go to [Uploadthing Dashboard](https://uploadthing.com/dashboard)
2. Select your app
3. Add your production domain to **Allowed Origins**:
   ```
   https://your-app.vercel.app
   ```

## 4. Domain Configuration (Optional)

### Custom Domain

1. In Vercel project settings → **Domains**
2. Add your custom domain (e.g., `snugbug.ch`)
3. Follow DNS configuration instructions
4. Update environment variables:
   ```bash
   AUTH_URL="https://snugbug.ch"
   NEXT_PUBLIC_APP_URL="https://snugbug.ch"
   ```
5. Update Google OAuth redirect URIs with new domain
6. Update Stripe webhook endpoint URL

## 5. Monitoring & Maintenance

### Vercel Analytics

Enable in Vercel project settings → **Analytics**

### Database Backups (Railway)

1. Go to your Railway PostgreSQL service
2. Click **Settings** → **Backups**
3. Enable automatic backups

### Environment Variable Updates

To update environment variables:
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Update the value
3. Redeploy the application for changes to take effect

## 6. Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will auto-deploy
```

### Preview Deployments

- Every pull request gets a preview deployment
- Test changes before merging to main
- Preview URL: `your-app-git-branch-username.vercel.app`

## 7. Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":
1. Check Railway database is running
2. Verify `DATABASE_URL` is correct in Vercel
3. Check Railway database is not paused (free tier)

### Build Failures

Check Vercel build logs:
1. Go to **Deployments** tab
2. Click on failed deployment
3. View **Build Logs**

Common issues:
- Missing environment variables
- TypeScript errors
- Prisma client not generated

Solution: Ensure `postinstall` script in `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### OAuth Redirect Errors

Ensure redirect URIs match exactly:
- Vercel URL: `https://your-app.vercel.app/api/auth/callback/google`
- No trailing slashes
- HTTPS only in production

## 8. Security Checklist

- [ ] Use production Stripe keys (not test keys)
- [ ] Generate strong `AUTH_SECRET`
- [ ] Configure CORS properly for Uploadthing
- [ ] Set up Stripe webhooks with signature verification
- [ ] Enable Vercel authentication protection for preview deployments
- [ ] Review and restrict API rate limits
- [ ] Enable database backups on Railway
- [ ] Set up error monitoring (e.g., Sentry)

## 9. Cost Estimation

### Free Tier (Development/Testing)
- **Vercel**: Free for personal projects
- **Railway**: $5 credit, ~$5/month for PostgreSQL
- **Uploadthing**: 2GB free, then pay-as-you-go
- **Stripe**: No monthly fee, 2.9% + 30¢ per transaction

### Production (Estimated)
- **Vercel Pro**: $20/month (if needed for team features)
- **Railway**: $5-20/month (depending on database size)
- **Uploadthing**: ~$0.10 per GB
- **Stripe**: Transaction fees only

## Support

For issues specific to:
- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Railway**: [Railway Documentation](https://docs.railway.app)
- **Uploadthing**: [Uploadthing Docs](https://docs.uploadthing.com)
