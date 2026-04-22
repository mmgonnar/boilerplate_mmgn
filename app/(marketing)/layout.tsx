import { Header } from '@/features/navigation';
import { Footer } from '@/features/navigation';

export const metadata = {
  openGraph: {
    type: 'website',
    locale: 'es_MX',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="h-full w-full">{children}</main>
      <Footer />
    </div>
  );
}
