import { Logo } from '@/components';
import { LanguageToggle, ThemeToggle } from '@/components/ui';

import { Footer } from '@/features/navigation';
import { FooterAuth } from '@/features/navigation/components/footer';

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
        <div className="flex gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      {/* Contenido centrado */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer mínimo */}

      <FooterAuth />
    </div>
  );
}
