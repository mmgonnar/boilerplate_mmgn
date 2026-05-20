import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { createClient } from '@/lib/supabase/server';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?error=unauthorized');
  }

  // Cargamos y combinamos las traducciones necesarias
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  const [commonMessages, authMessages] = await Promise.all([
    import(`@/messages/${locale}.json`),
    import(`@/features/auth/messages/${locale}.json`),
  ]);

  const messages = {
    ...commonMessages.default,
    ...authMessages.default,
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <ResetPasswordForm />
      </div>
    </NextIntlClientProvider>
  );
}
