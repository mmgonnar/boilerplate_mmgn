import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/register'];
const LOCALES = ['es', 'en'];

// ✅ Strip locale prefix for clean matching
function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }
  return pathname;
}

// ✅ Exact prefix match — prevents path traversal
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = intlMiddleware(request);

  const cleanPath = stripLocale(pathname);
  const isProtectedRoute = matchesRoute(cleanPath, PROTECTED_ROUTES);
  const isAuthRoute = matchesRoute(cleanPath, AUTH_ROUTES);

  if (!isProtectedRoute && !isAuthRoute) {
    return response;
  }

  const { client: supabase } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Authenticated user on auth route → redirect to dashboard with locale
  if (user && isAuthRoute) {
    const locale = pathname.split('/')[1];
    const localizedTarget = LOCALES.includes(locale)
      ? `/${locale}/dashboard`
      : '/dashboard';
    return NextResponse.redirect(new URL(localizedTarget, request.url));
  }

  // ✅ Unauthenticated user on protected route → redirect to login
  if (!user && isProtectedRoute) {
    const locale = pathname.split('/')[1];
    const localizedLogin = LOCALES.includes(locale)
      ? `/${locale}/login`
      : '/login';
    const redirectUrl = new URL(localizedLogin, request.url);

    // ✅ Only allow safe internal redirects
    const isSafeRedirect =
      cleanPath.startsWith('/') && !cleanPath.startsWith('//');
    if (isSafeRedirect) {
      redirectUrl.searchParams.set('redirect', cleanPath);
    }

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|auth/callback|auth/reset-password|.*\\..*).*)',
  ],
};
