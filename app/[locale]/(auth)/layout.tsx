import { Logo } from '@/components';
import { ThemeToggle } from '@/components/ui';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Header mínimo */}
      <header className="flex h-16 items-center justify-between px-6">
        <Logo />
        <ThemeToggle />
      </header>

      {/* Contenido centrado */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer mínimo */}
      <footer className="flex h-16 items-center justify-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Boilerplate. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
}
