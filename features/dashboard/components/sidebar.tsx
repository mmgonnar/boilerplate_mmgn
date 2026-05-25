'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Logo } from '@/components';
import { Button } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { LogOut } from 'lucide-react';

export function Sidebar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const t = useTranslations('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user && !isLoggingOut) {
      router.push('/login');
    }
  }, [user, router, isLoggingOut]);

  if (!user) return null;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const toastId = toast.loading('Cerrando sesión...');

    try {
      await signOut();
      toast.success('Sesión cerrada correctamente', { id: toastId });
      router.push('/login');
    } catch (error: any) {
      setIsLoggingOut(false);
      toast.error(
        error.message || 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
        { id: toastId },
      );
    }
  };

  return (
    <>
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <Logo />

        <div className="flex-1 mt-6">{/* nav del dashboard aqui*/}</div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          leftIcon={<LogOut size={18} />}
        >
          {isLoggingOut ? t('logout.signing_out') : t('logout.sign_out')}
        </Button>
      </aside>
    </>
  );
}
