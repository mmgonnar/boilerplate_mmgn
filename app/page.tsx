import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <div>Hello world!</div>

      <Button
        href="http://localhost:3000/design-system"
        variant="outline"
        rightIcon={<ExternalLink size={18} />}
        target="_blank"
      >
        Ir alDesign System
      </Button>
    </main>
  );
}
