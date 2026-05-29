import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};
interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return <LoginForm redirectTo={redirect || '/dashboard'} />;
}
