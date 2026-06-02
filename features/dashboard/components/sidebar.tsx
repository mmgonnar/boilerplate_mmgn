'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Logo } from '@/components';
import { Avatar, Button } from '@/components/ui';
import { apiCallToast } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { LogOut, Settings } from 'lucide-react';

type SidebarProps = {
  userEmail?: string;
  userSrc?: string;
};

export function Sidebar({ userEmail, userSrc }: SidebarProps) {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut) {
      router.push('/login');
    }
  }, [user, router, isLoggingOut, isLoading]);

  if (isLoading) return null;

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    apiCallToast(signOut(), {
      loading: 'Cerrando sesión...',
      successMessage: 'Sesión cerrada correctamente',
      errorMessage: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
      redirectTo: '/login',
      router: router,
    }).finally(() => {
      setIsLoggingOut(false);
    });
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-6">
      <Logo />

      <div className="flex items-center gap-2 max-w-[200px] mt-4">
        <Avatar
          src={userSrc || user.user_metadata?.avatar_url}
          fallbackText={userEmail || user.email}
          size="sm"
        />
        <span className="text-sm truncate">{userEmail || user.email}</span>
      </div>

      <div className="flex-1 mt-6">{/* nav del dashboard aqui*/}</div>

      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          href="/profile"
          disabled
          className="w-full justify-start text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          leftIcon={<Settings size={18} />}
        >
          {t('settings')}
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          leftIcon={<LogOut size={18} />}
        >
          {isLoggingOut ? t('logout.signing_out') : t('logout.sign_out')}
        </Button>
      </div>
    </aside>
  );
}
