import { NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const type = searchParams.get('type');
  const defaultRedirect =
    type === 'recovery' ? '/auth/reset-password' : '/dashboard';

  // Only allow same-origin paths: "/..." but not "//host" (open redirect).
  const requestedNext = searchParams.get('next');
  const next =
    requestedNext &&
    requestedNext.startsWith('/') &&
    !requestedNext.startsWith('//')
      ? requestedNext
      : defaultRedirect;

  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription ?? '')}`,
    );
  }

  if (code) {
    const redirectResponse = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const urlHeaders = new Headers(request.headers);
            const cookieHeader = urlHeaders.get('cookie') ?? '';
            return cookieHeader
              .split(';')
              .map((c) => {
                const [name, ...value] = c.trim().split('=');
                return { name, value: value.join('=') };
              })
              .filter((c) => c.name !== '');
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return redirectResponse;
    }

    console.error('Exchange error:', exchangeError);
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
