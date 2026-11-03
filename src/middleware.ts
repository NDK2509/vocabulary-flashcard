import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, verifyTokenEdge } from '@/lib/auth/token';

const PROTECTED_PREFIXES = ['/dashboard', '/flashcards'];
const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const validToken = signedToken ? await verifyTokenEdge(signedToken) : null;
  const isAuthenticated = Boolean(validToken);

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // 1. If accessing a protected route without being authenticated -> redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. If authenticated user attempts to access /login or /register -> redirect to /dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (assets, svgs, etc.)
     * - api routes (handled directly by Route Handlers)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
