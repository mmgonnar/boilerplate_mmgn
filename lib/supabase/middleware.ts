// src/lib/supabase/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

export function createClient(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const fakeClient = new Proxy(
      {} as unknown as ReturnType<typeof createServerClient>,
      {
        get() {
          return () => {
            throw new Error(
              'El cliente del middleware de Supabase no está disponible en modo Landing.',
            );
          };
        },
      },
    );
    return { client: fakeClient, supabaseResponse };
  }

  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  return { client, supabaseResponse };
}
