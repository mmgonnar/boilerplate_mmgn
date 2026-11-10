'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/providers/auth-provider';

import { Sidebar, useLogoutMessages } from '@/features/dashboard';
import { HeaderDashboard } from '@/features/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const logoutMessages = useLogoutMessages();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut) {
      router.push('/login');
    }
  }, [user, router, isLoading, isLoggingOut]);

  if (!user) return null;

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const toastId = toast.loading(logoutMessages.loading);

    try {
      await signOut();
      toast.success(logoutMessages.success, { id: toastId });
      router.push('/login');
    } catch (error) {
      setIsLoggingOut(false);

      // ✅ Only trust the error's own text when it actually carries one
      const errorMessage =
        error instanceof Error ? error.message : logoutMessages.error;

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
