import { auth } from "@/auth";
import { User, Session } from "./types";

/**
 * Get the current user session in server components
 * @returns Promise<User | null> - The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (session?.user) {
    return {
      id: (session.user as any).id || '',
      email: session.user.email || '',
      name: session.user.name || '',
    };
  }
  return null;
}

/**
 * Get the current user session with full session data
 * @returns Promise<Session | null> - The full session or null if not authenticated
 */
export async function getCurrentSession(): Promise<Session | null> {
  return await auth();
}

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> - True if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user;
} 