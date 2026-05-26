import { LoginForm } from '@/features/auth';

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <LoginForm redirectTo={redirect || '/dashboard'} />
    </div>
  );
}
