'use client';

import { useState } from 'react';

import { Button, Input, ThemeToggle } from '@/components/ui';
import {
  ChevronLeft,
  ExternalLink,
  Mail,
  Plus,
  Save,
  Search,
  Trash2,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Button
            href="/"
            variant="ghost"
            size="sm"
            leftIcon={<ChevronLeft size={16} />}
          >
            Regresar
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Probar Temas:
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ✅ tokens en lugar de colores hardcodeados */}
      <main className="p-10 space-y-12 bg-background min-h-screen">
        <header className="border-b border-border pb-8">
          <h1 className="text-4xl font-bold text-foreground">Design System</h1>
          <p className="text-muted-foreground mt-2">
            Guía de estilos y componentes para boilerplate.
          </p>
        </header>

        <section>
          <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
            — Theme Toggle
          </h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-muted-foreground">
              Cambia entre modo claro y oscuro
            </span>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
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

        <section>
          <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
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

        <section>
          <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
            — Botones: Como Enlaces (Polimorfismo)
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              href="/dashboard"
              variant="outline"
              leftIcon={<Mail size={18} />}
            >
              Ir al Dashboard
            </Button>
            {/* ✅ target="_blank" eliminado — external ya lo hace */}
            <Button
              href="https://github.com/mmgonnar"
              external
              variant="ghost"
              rightIcon={<ExternalLink size={18} />}
            >
              Ver GitHub
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
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

        <section className="space-y-6">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            — Inputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <Input label="Nombre de usuario" placeholder="@mmgonnar" />
            <Input
              label="Correo Electrónico"
              placeholder="tu@email.com"
              leftIcon={<Mail size={16} />}
              hint="Nunca compartiremos tu correo."
            />
            <Input
              label="Contraseña"
              type="password"
              error="La contraseña debe tener al menos 8 caracteres"
              defaultValue="123"
            />
            <Input label="ID de Estudiante" disabled defaultValue="2025-001" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            — Búsqueda y Filtros
          </h2>
          <div className="flex gap-2 max-w-xl">
            <Input
              placeholder="Buscar estudiantes..."
              leftIcon={<Search size={18} className="text-muted-foreground" />}
            />
            <Button variant="secondary" className="px-6">
              Buscar
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            — Grupos de Acción
          </h2>
          {/* ✅ bg-card reemplazado por bg-background hasta añadir el token */}
          <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-background">
            <Button variant="outline" size="sm">
              Cancelar
            </Button>
            <Button size="sm">Guardar Cambios</Button>
            <div className="flex-1" />
            <Button variant="danger" size="icon" aria-label="Eliminar">
              <Trash2 size={16} />
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            — Validación de Formulario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border border-destructive/20 rounded-xl bg-destructive/5">
            <Input
              label="Nueva Contraseña"
              type="password"
              defaultValue="short"
              error="La contraseña es demasiado corta (mínimo 8 caracteres)"
            />
            <Input
              label="Confirmar Contraseña"
              type="password"
              error="Las contraseñas no coinciden"
            />
          </div>
        </section>

        <section className="py-12 px-6 border-2 border-dashed border-border rounded-3xl text-center space-y-4">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Plus size={24} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              No hay proyectos activos
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Comienza creando tu primer proyecto de gestión o importa uno desde
              tu dashboard.
            </p>
          </div>
          <Button leftIcon={<Plus size={18} />}>Crear Proyecto</Button>
        </section>
      </main>
    </>
  );
}
