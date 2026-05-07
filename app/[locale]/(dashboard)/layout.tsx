import { redirect } from 'next/navigation';

const isAuthenticated = true; // ← temporal

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Protección de ruta — redirige si no está autenticado
  if (!isAuthenticated) redirect('/login');

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — placeholder hasta construirlo */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <p className="text-xs text-muted-foreground">Sidebar — próximamente</p>
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
