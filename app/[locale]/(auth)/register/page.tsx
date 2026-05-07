import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear cuenta',
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Completa el formulario para registrarte
        </p>
      </div>
      {/* RegisterForm — próximamente */}
    </div>
  );
}
