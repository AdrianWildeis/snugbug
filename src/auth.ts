import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email-based login for development (no password needed)
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'alice@example.com' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        }

        return null;
      },
    }),
    // OAuth providers (optional - only work if credentials are set)
    ...(process.env.AUTH_GOOGLE_ID ? [Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })] : []),
    ...(process.env.AUTH_FACEBOOK_ID ? [Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    })] : []),
  ],
  session: {
    strategy: 'jwt', // Use JWT for Credentials provider
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;

        // Fetch custom fields from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            stripeConnectId: true,
            stripeOnboarded: true,
            location: true,
            phone: true,
          },
        });

        if (dbUser) {
          session.user.stripeConnectId = dbUser.stripeConnectId;
          session.user.stripeOnboarded = dbUser.stripeOnboarded;
          session.user.location = dbUser.location;
          session.user.phone = dbUser.phone;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
});
