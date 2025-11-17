import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'

// Helper function to validate session cookie
function isValidSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false
  
  try {
    const userData = JSON.parse(cookieValue)
    // Check if the session has required fields and is an admin
    return !!(
      userData &&
      userData.id &&
      userData.email &&
      userData.Role === 'admin' &&
      userData.timestamp
    )
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user has a valid session cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const hasValidSession = isValidSession(sessionCookie?.value)

  // Public routes that don't require authentication
  const isLoginPage = pathname === '/login'

  // Protected routes - everything except /login
  const isProtectedRoute = !isLoginPage

  // Debug logging (remove in production)
  console.log('[Middleware]', {
    pathname,
    hasValidSession,
    isLoginPage,
    isProtectedRoute,
    cookieExists: !!sessionCookie?.value,
  })

  // If user is trying to access login page and already has a valid session, redirect to dashboard
  if (isLoginPage && hasValidSession) {
    console.log('[Middleware] Redirecting: already logged in, go to dashboard')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is trying to access protected routes without a valid session, redirect to login
  if (isProtectedRoute && !hasValidSession) {
    console.log('[Middleware] Redirecting: no valid session, go to login')
    // Clear invalid session cookie if it exists
    const response = NextResponse.redirect(new URL('/login', request.url))
    if (sessionCookie) {
      response.cookies.delete(SESSION_COOKIE_NAME)
    }
    return response
  }

  console.log('[Middleware] Allowing access')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
