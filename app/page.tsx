import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main>
      <div>Hello world!</div>
      <Button>Click me</Button>
      <Button variant="outline">Click me</Button>
      <Button variant="danger">Click me</Button>
      <Button variant="ghost">Click me</Button>
    </main>
  );
}
