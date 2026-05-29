import { FooterAuth, HeaderAuth } from '@/features/navigation';

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
      <HeaderAuth />

      {/* Contenido centrado */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <FooterAuth />
    </div>
  );
}
