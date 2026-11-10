import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { routing } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/middleware';

const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];

const intlMiddleware = createMiddleware(routing);

// Matches a locale segment only when the path ends there or a slash follows,
// so /es/dashboard loses its prefix while /esports keeps its path intact.
const LOCALE_PREFIX_PATTERN = new RegExp(
  `^/(?:${routing.locales.join('|')})(?=/|$)`,
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Drop static files and browser assets straight away
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.endsWith('.ico') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Run the locale middleware first to get the structured base response
  const response = intlMiddleware(request);

  // 3. Build the Supabase client around that locale response
  // This lets Supabase write headers and cookies onto the response the browser actually receives
  const { client: supabase, supabaseResponse } = createClient(
    request,
    response,
  );

  // 4. Read the authenticated user through the middleware client
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Strip the locale from the pathname before matching protected routes
  const cleanPath =
    pathname.replace(LOCALE_PREFIX_PATTERN, '').replace(/\/$/, '') || '/';

  const isProtected = PROTECTED_ROUTES.some(
    (route) => cleanPath === route || cleanPath.startsWith(route + '/'),
  );

  // 6. Protected route with no user, send them to the login page
  if (isProtected && !user) {
    const locale =
      request.cookies.get('NEXT_LOCALE')?.value || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    const redirectRes = NextResponse.redirect(loginUrl);

    // Carry the cookies collected so far over to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      const { name, value, ...options } = cookie;
      redirectRes.cookies.set(name, value, options);
    });

    return redirectRes;
  }

  // 7. Public route or signed-in user, return the response Supabase mutated
  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|auth/callback|auth/reset-password|.*\\..*).*)',
  ],
};
