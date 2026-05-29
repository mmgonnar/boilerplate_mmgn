import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import { ResetPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Design System',
};

export const dynamic = 'force-dynamic';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

  if (!user) {
    redirect(`/${locale}/login?error=unauthorized`);
  }

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
