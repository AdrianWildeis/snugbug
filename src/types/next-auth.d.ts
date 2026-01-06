import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      stripeConnectId?: string | null;
      stripeOnboarded?: boolean;
      location?: string | null;
      phone?: string | null;
      isAdmin?: boolean;
    } & DefaultSession['user'];
  }
}
