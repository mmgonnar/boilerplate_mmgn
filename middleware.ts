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
  let response = intlMiddleware(request); // 🚀 Cambiamos a 'let' para poder actualizarla

  const cleanPath = stripLocale(pathname);
  const isProtectedRoute = matchesRoute(cleanPath, PROTECTED_ROUTES);
  const isAuthRoute = matchesRoute(cleanPath, AUTH_ROUTES);

  if (!isProtectedRoute && !isAuthRoute) {
    return response;
  }

  // 🚀 PASO CLAVE: Inicializamos Supabase pasando el request y la response actual.
  // Tu función createClient interna debe retornar tanto el cliente como la respuesta modificada.
  const { client: supabase, response: updatedResponse } = createClient(
    request,
    response,
  );

  // Si tu archivo lib/supabase/middleware.ts no retorna 'response',
  // asegúrate de que internamente esté mutando el objeto 'response' que le pasas por parámetro.
  if (updatedResponse) {
    response = updatedResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Authenticated user on auth route → redirect to dashboard with locale
  if (user && isAuthRoute) {
    const locale = pathname.split('/')[1];
    const localizedTarget = LOCALES.includes(locale)
      ? `/${locale}/dashboard`
      : '/dashboard';

    // 🚀 Clonamos la redirección pero le copiamos las cookies que Supabase generó arriba
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
