import { Button } from '@/components/ui';
import { ExternalLink } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="flex h-full flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-foreground mb-4">Boilerplate</h1>
      <p className="text-lg text-muted-foreground max-w-md mb-10">
        Production-ready. Listo para personalizar.
      </p>
      <Button
        href="http://localhost:3000/design-system"
        variant="outline"
        rightIcon={<ExternalLink size={18} />}
        target="_blank"
      >
        Ir alDesign System
      </Button>
    </section>
  );
}
