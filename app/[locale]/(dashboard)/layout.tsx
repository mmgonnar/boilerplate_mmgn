'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/auth-provider';

import { Sidebar } from '@/features/dashboard';
import { HeaderDashboard } from '@/features/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
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
    } catch (error) {
      // 🚀 Eliminamos el ": any" aquí, dejando que TypeScript use su comportamiento nativo
      setIsLoggingOut(false);

      // ✅ Evaluamos de forma segura si el error tiene un mensaje de texto
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo cerrar la sesión. Inténtalo de nuevo.';

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userEmail={user.email} />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <HeaderDashboard
          userEmail={user.email}
          userSrc={user.user_metadata?.avatar_url}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
