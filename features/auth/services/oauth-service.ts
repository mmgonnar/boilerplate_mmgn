// features/auth/services/oauth-service.ts
import { createClient } from '@/lib/supabase/client';
import { Provider } from '@supabase/supabase-js';

export const signInWithOAuth = async (provider: Provider): Promise<void> => {
  const supabase = createClient();
  const redirectTo = `${window.location.origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams:
        provider === 'google'
          ? {
              access_type: 'offline',
              prompt: 'select_account',
            }
          : undefined,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};
