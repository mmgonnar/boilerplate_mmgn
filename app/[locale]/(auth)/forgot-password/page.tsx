import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Olvidé mi contraseña',
};

export default function LoginPage() {
  return <ForgotPasswordForm />;
}
