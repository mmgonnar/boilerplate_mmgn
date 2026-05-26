import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage({ createdAt, lastSignInAt }) {
  const isNewUser = React.useMemo(() => {
    if (!createdAt || !lastSignInAt) return false;

    const created = new Date(createdAt).getTime();
    const lastLogin = new Date(lastSignInAt).getTime();

    // Si la diferencia entre creación y login es menor a 10 segundos, es un registro fresco
    return Math.abs(lastLogin - created) < 10000;
  }, [createdAt, lastSignInAt]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <h1 className="text-sm font-semibold mt-0.5 text-muted-foreground">
        {isNewUser ? (
          <span className="text-primary">
            ¡Te damos la bienvenida a bordo! ✨
          </span>
        ) : (
          <span>¡Qué bueno verte de nuevo! 👋 </span>
        )}
      </h1>
    </div>
  );
}
