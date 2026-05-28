import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/register'];
const LOCALES = ['es', 'en'];

function stripLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(locale.length + 1) || '/';
    }
  }
  return pathname;
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = intlMiddleware(request);

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!hasSupabase) {
    return response;
  }

  const cleanPath = stripLocale(pathname);
  const isProtectedRoute = matchesRoute(cleanPath, PROTECTED_ROUTES);
  const isAuthRoute = matchesRoute(cleanPath, AUTH_ROUTES);

  if (!isProtectedRoute && !isAuthRoute) {
    return response;
  }

  const { client: supabase, supabaseResponse: updatedResponse } =
    createClient(request);

  if (updatedResponse) {
    response = updatedResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAuthRoute) {
    const locale = pathname.split('/')[1];
    const localizedTarget = LOCALES.includes(locale)
      ? `/${locale}/dashboard`
      : '/dashboard';

    const redirectRes = NextResponse.redirect(
      new URL(localizedTarget, request.url),
    );

    response.cookies
      .getAll()
      .forEach((cookie) => redirectRes.cookies.set(cookie.name, cookie.value));

    return redirectRes;
  }

  if (!user && isProtectedRoute) {
    const locale = pathname.split('/')[1];
    const localizedLogin = LOCALES.includes(locale)
      ? `/${locale}/login`
      : '/login';
    const redirectUrl = new URL(localizedLogin, request.url);

    const isSafeRedirect =
      cleanPath.startsWith('/') && !cleanPath.startsWith('//');
    if (isSafeRedirect) {
      redirectUrl.searchParams.set('redirect', pathname);
    }

    const redirectRes = NextResponse.redirect(redirectUrl);

    response.cookies
      .getAll()
      .forEach((cookie) => redirectRes.cookies.set(cookie.name, cookie.value));

    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|auth/callback|auth/reset-password|.*\\..*).*)',
  ],
};
