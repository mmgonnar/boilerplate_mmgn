import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Login',
};
type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  // Only allow same-origin paths: "/..." but not "//host" (open redirect).
  const safeRedirect =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : '/dashboard';

  return <LoginForm redirectTo={safeRedirect} />;
}
