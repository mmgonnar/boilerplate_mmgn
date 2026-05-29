import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Olvidé mi contraseña',
};

export default function LoginPage() {
  return <ForgotPasswordForm />;
}
