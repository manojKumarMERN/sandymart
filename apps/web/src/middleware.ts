import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/register', '/forgot-password'];
const protectedPaths = ['/profile', '/orders', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');

  const hasToken = accessToken || refreshToken;

  const isAuthenticated = Boolean(hasToken);

  console.log(isAuthenticated, accessToken, refreshToken, "isAuthenticated");


  // Skip internal/static paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ❌ NOT authenticated → protected route → redirect to login
  if (
    !isAuthenticated &&
    protectedPaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ Authenticated → prevent visiting auth pages
  if (
    isAuthenticated &&
    publicPaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
