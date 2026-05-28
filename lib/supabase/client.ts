// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Proxy({} as unknown as ReturnType<typeof createBrowserClient>, {
      get() {
        return () => {
          throw new Error(
            'El cliente de Supabase no está disponible en modo Landing.',
          );
        };
      },
    });
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
