import type { Metadata } from 'next';

import { LoginFormExample } from '@/components/design-system';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
};

export default function LoginPage() {
  return <LoginFormExample />;
}
