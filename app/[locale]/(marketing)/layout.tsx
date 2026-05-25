import { Header } from '@/features/navigation';
import { Footer } from '@/features/navigation';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="w-full overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}
