import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/middleware';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

const intlMiddleware = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let response = intlMiddleware(request);

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!hasSupabase) {
    return response;
  }

  const { client: supabase, supabaseResponse: updatedResponse } = createClient(
    request,
    response,
  );

  if (updatedResponse) {
    response = updatedResponse; // Contiene locale AND cookies de Supabase mutadas
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cleanPath = pathname.replace(/^\/(es|en)/, '') || '/';
  const isProtected = PROTECTED_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(route + '/'),
  );

  if (isProtected && !user) {
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const redirectRes = NextResponse.redirect(loginUrl);

    response.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie.name, cookie.value);
    });

    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|auth/callback|auth/reset-password|.*\\..*).*)',
  ],
};
