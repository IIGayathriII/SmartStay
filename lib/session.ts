'use server'
import { cookies } from 'next/headers';

type UserRole = 'student' | 'lender' | 'admin';

interface SessionData {
  email: string;
  role: UserRole;
  expires: string;
}

/**
 * Creates a session and returns cookie settings to be applied in an API route.
 * @param email - User's email
 * @param role - User's role
 * @returns Cookie configuration object
 */
export async function createSession(email: string, role: UserRole) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const sessionData: SessionData = { email, role, expires: expires.toISOString() };
  const cookieValue = JSON.stringify(sessionData);

  return {
    name: 'session',
    value: cookieValue,
    options: {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax' as const,
    },
  };
}

/**
 * Retrieves the current session data from cookies.
 * @returns Session data or null if no valid session exists
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies(); // Await the promise to get ReadonlyRequestCookies
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  try {
    return JSON.parse(session) as SessionData;
  } catch {
    return null; // Return null if parsing fails (e.g., invalid JSON)
  }
}

/**
 * Returns cookie settings to destroy the session by expiring it.
 * @returns Cookie configuration object to delete the session
 */
export async function destroySession() {
  return {
    name: 'session',
    value: '', // Empty value to clear the cookie
    options: {
      expires: new Date(0), // Set expiration to the past to delete
      path: '/',
    },
  };
}