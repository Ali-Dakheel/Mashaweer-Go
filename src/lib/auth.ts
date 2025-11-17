import { cookies } from 'next/headers'
import { UserLoginResponse } from './schemas'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 'session' // Session-only cookie (expires when browser closes)

/**
 * Create a session cookie with user data
 */
export async function createSessionCookie(user: UserLoginResponse) {
  const cookieStore = await cookies()

  // Store user data as JSON in the cookie
  const userData = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    Role: user.Role,
    timestamp: Date.now(),
  })

  cookieStore.set(SESSION_COOKIE_NAME, userData, {
    httpOnly: true, // Cannot be accessed by JavaScript (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
    sameSite: 'lax', // CSRF protection
    path: '/',
    maxAge: undefined, // Session-only cookie (deleted when browser closes)
  })
}

/**
 * Get the current user session from cookies
 */
export async function getSession(): Promise<UserLoginResponse | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie || !sessionCookie.value) {
    return null
  }

  try {
    const userData = JSON.parse(sessionCookie.value)
    return userData as UserLoginResponse
  } catch {
    return null
  }
}

/**
 * Delete the session cookie (logout)
 */
export async function deleteSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Check if user is authenticated and is an admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null && session.Role === 'admin'
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<UserLoginResponse | null> {
  return getSession()
}
