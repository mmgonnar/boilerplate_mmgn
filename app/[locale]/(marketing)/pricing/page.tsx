import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
};
export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground">Pricing</h1>
    </div>
  );
}
