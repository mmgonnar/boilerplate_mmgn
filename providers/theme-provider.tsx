'use client';

import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // 1. Creamos un estado para saber si ya estamos en el cliente
  const [mounted, setMounted] = React.useState(false);

  // 2. useEffect solo corre en el cliente tras el primer render
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Si no ha montado, devolvemos los hijos sin el wrapper de next-themes
  // Esto evita que el script "prohibido" se renderice en el servidor
  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
