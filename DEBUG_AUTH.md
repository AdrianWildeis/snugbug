# Authentication Debugging Guide

## 🔍 Step-by-Step Debugging

### 1. Check if Database is Seeded
Visit: `http://localhost:3000/api/test-users`

You should see something like:
```json
{
  "success": true,
  "count": 3,
  "users": [
    {
      "id": "...",
      "email": "alice@example.com",
      "name": "Alice Johnson",
      "createdAt": "..."
    },
    // ... more users
  ]
}
```

### 2. Check Environment Variables
Make sure your `.env.local` has:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="any-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Check Browser Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Try to sign in
4. Look for console.log messages showing:
   - "Attempting to sign in with: ..."
   - "Sign in result: ..."

### 4. Test Database Connection
```bash
# Check if Prisma can connect
npx prisma db pull

# Check if users exist
npx prisma studio
```

## 🚨 Common Issues

### Issue: "Invalid credentials" error
**Possible causes:**
1. Database not seeded - Run `npm run db:seed`
2. Wrong email - Use exact emails: `alice@example.com`
3. Missing password - Password field must not be empty

### Issue: Database connection error
**Possible causes:**
1. Wrong DATABASE_URL format
2. Database not running
3. Wrong credentials

### Issue: NextAuth not working
**Possible causes:**
1. Missing NEXTAUTH_SECRET
2. Wrong NEXTAUTH_URL
3. SessionProvider not wrapping app

## 🧪 Quick Test Commands

```bash
# 1. Check if you're in the right directory
pwd  # Should show: /Users/adrianwildeis/Documents/Work/2025/Snugbug/snugbug-app

# 2. Check if database is seeded
curl http://localhost:3000/api/test-users

# 3. Check environment variables
cat .env.local

# 4. Regenerate Prisma client
npx prisma generate

# 5. Restart the server
npm run dev
```

## 📧 Test Credentials

**Valid test emails:**
- `alice@example.com`
- `bob@example.com`
- `carol@example.com`

**Password:** Any password (not empty)

## 🔧 Manual Database Check

If the API doesn't work, check manually:

```bash
# Connect to your database and run:
SELECT id, email, name FROM "User";
```

You should see 3 users with the test emails. 