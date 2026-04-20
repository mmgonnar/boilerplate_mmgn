'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';
import {
  ChevronLeft,
  ExternalLink,
  Mail,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="p-10 space-y-12 bg-neutral-200 min-h-screen text-neutral-800">
      <nav className="mb-8">
        <Button
          href="/"
          variant="ghost"
          size="sm"
          leftIcon={<ChevronLeft size={16} />}
          className="-ml-2 text-neutral-400 hover:text-neutral-500"
        >
          Regresar al Inicio
        </Button>
      </nav>
      <header className="border-b border-neutral-800 pb-8">
        <h1 className="text-4xl font-bold">Design System</h1>
        <p className="text-neutral-700 mt-2">
          Guía de estilos y componentes para boilerplate.
        </p>
      </header>
      {/* ─── Botón normal ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 mb-6 uppercase tracking-widest">
          — Botones: Variantes
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      {/* ─── Botón normal y variantes ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 mb-6 uppercase tracking-widest">
          — Botones: Estados y Carga
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2000);
            }}
            isLoading={loading}
            leftIcon={<Save size={18} />}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>

          <Button isLoading variant="outline">
            Cargando
          </Button>
        </div>
      </section>
      {/* ─── Botón enlaces externos (polimorfismo) ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 mb-6 uppercase tracking-widest">
          — Botones: Como Enlaces (Polimorfismo)
        </h2>
        <div className="flex flex-wrap gap-4">
          {/* Link interno */}
          <Button
            href="/dashboard"
            variant="outline"
            leftIcon={<Mail size={18} />}
          >
            Ir al Dashboard
          </Button>

          {/* Link externo */}
          <Button
            href="https://github.com/mmgonnar"
            external
            variant="ghost"
            rightIcon={<ExternalLink size={18} />}
            target="_blank"
          >
            Ver GitHub
          </Button>
        </div>
      </section>
      {/* ─── Tamaños e Iconos ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-mono text-neutral-500 mb-6 uppercase tracking-widest">
          — Botones: Tamaños e Iconos
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <Button size="sm">Pequeño</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" variant="danger" aria-label="Eliminar">
            <Trash2 size={18} />
          </Button>
          <Button size="icon" className="rounded-full">
            <Plus size={18} />
          </Button>
        </div>
      </section>
    </main>
  );
}
