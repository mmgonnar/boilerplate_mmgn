import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Proxy({} as any, {
      get() {
        return () => {
          throw new Error(
            'El cliente de Supabase no está configurado ni disponible en el modo de Solo Landing.',
          );
        };
      },
    });
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
