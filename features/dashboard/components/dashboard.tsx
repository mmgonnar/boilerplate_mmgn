'use client';

import React from 'react';

import { useAuth } from '@/providers/auth-provider';

import { UpdateAvatar } from '@/features/profile/components/update-avatar';

export function Dashboard() {
  const { user } = useAuth();
  const createdAt = user?.created_at;
  const lastSignInAt = user?.last_sign_in_at;

  const isNewUser = React.useMemo(() => {
    if (!createdAt || !lastSignInAt) return false;

    const created = new Date(createdAt).getTime();
    const lastLogin = new Date(lastSignInAt).getTime();

    return Math.abs(lastLogin - created) < 10000;
  }, [createdAt, lastSignInAt]);

  React.useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <h2 className="text-sm font-semibold mt-0.5 text-muted-foreground">
        {isNewUser ? (
          <span className="text-primary">
            ¡Te damos la bienvenida a bordo! ✨
          </span>
        ) : (
          <span>¡Qué bueno verte de nuevo! 👋 </span>
        )}
      </h2>

      <UpdateAvatar />
    </div>
  );
}
