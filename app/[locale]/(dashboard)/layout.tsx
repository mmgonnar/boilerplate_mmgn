'use client';

import { useRouter } from 'next/navigation';

import { Logo } from '@/components';
import { Button } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { LogOut, User } from 'lucide-react';

// const isAuthenticated = true; // ← temporal (para testing)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // if (!isAuthenticated) redirect('/login');
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <Logo />
        {/* <div className="flex items-center gap-2 mb-6 p-2 rounded-md bg-accent">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm truncate">{user.email}</span>
        </div> */}

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sm"
          leftIcon={<LogOut size={18} />}
        >
          Cerrar sesión
        </Button>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-border bg-card">
          <div className="text-sm text-muted-foreground">Dashboard</div>
          <div className="flex gap-4 justify-center items-center">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">{user.email}</span>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
