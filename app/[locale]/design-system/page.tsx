'use client';

import React, { useState } from 'react';

import {
  LoginFormExample,
  ProfileFormExample,
} from '@/components/design-system';
import { SectionWrapper } from '@/components/design-system/section-wrapper';
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSeparator,
  CardTitle,
  Dialog,
  Input,
  LanguageToggle,
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonText,
  ThemeToggle,
} from '@/components/ui';
import {
  Book,
  Building,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Home,
  Lock,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  User,
  Zap,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar Sticky */}
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
            <LanguageToggle />
            <span className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              Probar Temas:
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-5xl p-6 md:p-10 space-y-24">
        {/* Header Principal */}
        <header className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tighter italic">
            Design System
          </h1>
          <p className="text-muted-foreground text-lg">
            Librería de componentes UI para proyectos MERN & Next.js.
          </p>
        </header>

        {/* --- BOTONES --- */}
        <SectionWrapper title="Buttons: Kitchen Sink">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Variantes de Color
              </p>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Tamaños y Estados
              </p>
              <div className="flex flex-wrap gap-3 items-end">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" variant="outline">
                  <Plus size={18} />
                </Button>
                <Button size="icon" className="rounded-full">
                  <Zap size={18} />
                </Button>
                <Button size="icon" variant="danger" aria-label="Eliminar">
                  <Trash2 size={18} />
                </Button>
              </div>
              <div className="flex gap-3">
                <Button
                  isLoading={loading}
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 2000);
                  }}
                >
                  {loading ? 'Procesando...' : 'Click para Cargar'}
                </Button>
                <Button variant="outline" isLoading disabled>
                  Cargando
                </Button>
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
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Botones: Como Enlaces (Polimorfismo)
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  href="/dashboard"
                  variant="outline"
                  leftIcon={<Mail size={18} />}
                >
                  Ir al Dashboard
                </Button>

                <Button
                  href="https://github.com/mmgonnar"
                  external
                  variant="ghost"
                  rightIcon={<ExternalLink size={18} />}
                >
                  Ver GitHub
                </Button>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* --- INPUTS --- */}
        <SectionWrapper title="Input System (Todos los estados)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Básicos
              </p>
              <Input label="Default" placeholder="Nombre completo" />
              <Input label="Requerido" required placeholder="mmgonnar" />
              <Input
                label="Deshabilitado"
                disabled
                defaultValue="No editable"
              />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Iconos e Info
              </p>
              <Input
                label="Correo"
                leftIcon={<Mail size={16} />}
                placeholder="tu@mail.com"
              />
              <Input
                label="Buscador"
                rightIcon={<Search size={16} />}
                placeholder="Filtrar datos..."
              />
              <Input
                label="Con Hint"
                hint="Mínimo 8 caracteres"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Validación
              </p>
              <Input
                label="Error"
                error="El formato del teléfono es inválido"
                defaultValue="+52 000"
              />
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-[10px] text-primary font-bold mb-3 uppercase">
                  Éxito Visual
                </p>
                <Input
                  placeholder="Configuración correcta"
                  className="border-primary/50 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* --- FORMULARIOS --- */}
        <SectionWrapper title="Complex Forms (RHF + Zod)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-sm italic text-muted-foreground">
                Formulario dinámico con mapeo de campos:
              </p>
              <div className="p-1 border-2 border-dashed border-border rounded-[2.2rem]">
                <div className="p-8 bg-card/30 rounded-4xl">
                  <ProfileFormExample />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm italic text-muted-foreground">
                Login estándar y validación simple:
              </p>
              <div className="p-1 border-2 border-dashed border-border rounded-[2.2rem]">
                <div className="p-8 bg-card/30 rounded-4xl">
                  <LoginFormExample />
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* --- BADGES --- */}
        <SectionWrapper title="Badges & Labels">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium">Variantes cva</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-medium">Dots de estado</p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="success" dot>
                    En línea
                  </Badge>
                  <Badge variant="warning" dot>
                    Ausente
                  </Badge>
                  <Badge variant="danger" dot>
                    Offline
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium">Tamaños y Composición</p>
                <div className="flex flex-wrap items-end gap-3">
                  <Badge size="sm" variant="secondary">
                    Small
                  </Badge>
                  <Badge size="default">Default</Badge>
                  <Badge
                    size="lg"
                    variant="default"
                    leftIcon={<Star size={12} fill="currentColor" />}
                  >
                    Featured
                  </Badge>
                </div>
              </div>
              <div className="p-4 border border-border rounded-xl bg-muted/20">
                <p className="text-[10px] font-bold uppercase mb-3 text-muted-foreground">
                  Uso en tabla
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User #892</span>
                  <Badge variant="success" dot size="sm">
                    Pagado
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* --- FEEDBACK --- */}
        <SectionWrapper title="Feedback & Layouts">
          <div className="py-16 border-2 border-dashed border-border rounded-[3rem] text-center space-y-4 bg-muted/5">
            <div className="bg-muted w-14 h-14 rounded-full flex items-center justify-center mx-auto border border-border">
              <Plus size={24} className="text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-tight">
                Crea tu primer proyecto
              </h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                Esta es una vista previa de un estado vacío (Empty State) para
                tu boilerplate.
              </p>
            </div>
            <Button leftIcon={<Plus size={18} />} variant="outline">
              Empezar ahora
            </Button>
          </div>
        </SectionWrapper>

        {/* --- CARDS --- */}
        <SectionWrapper title="Cards & Containers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Variante: Default */}
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>
                  Uso estándar para contenedores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Este es el contenido básico de una tarjeta con padding default.
              </CardContent>
            </Card>

            {/* Variante: Hoverable + elevated */}
            <Card variant="elevated" hoverable padding="sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Interactive Card</CardTitle>
                  <Badge variant="success" size="sm">
                    Active
                  </Badge>
                </div>
                <CardDescription>
                  Esta tarjeta reacciona al mouse.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Ideal para elementos de una lista o dashboard.
              </CardContent>
            </Card>

            {/* Caso de Uso: Perfil de Estudiante (ClassAid) */}
            <Card className="overflow-hidden border-primary/20">
              <div className="h-2 bg-primary w-full" />{' '}
              {/* Acento visual superior */}
              <CardHeader className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary">
                    MG
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Mariela González
                    </CardTitle>
                    <CardDescription>Nivel de Inglés: B2</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardSeparator className="my-0" />
              <CardContent className="py-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Asistencia:</span>
                  <span className="font-medium text-foreground">95%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Tareas:</span>
                  <span className="font-medium text-foreground">12/12</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4">
                <Button size="sm" variant="outline" className="w-full">
                  Ver Expediente
                </Button>
              </CardFooter>
            </Card>
          </div>
        </SectionWrapper>

        {/* --- BREADCRUMB --- */}
        <SectionWrapper title="Navigation: Breadcrumb (Data-driven)">
          <div className="space-y-8 p-8 border border-border rounded-2xl bg-card/10">
            {/* Caso 1: Básico con Iconos */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Con Iconos y Rutas
              </p>
              <Breadcrumb
                items={[
                  { label: 'Home', href: '/', icon: <Home size={14} /> },
                  {
                    label: 'Cursos',
                    href: '/cursos',
                    icon: <Book size={14} />,
                  },
                  { label: 'Inglés Avanzado' },
                ]}
              />
            </div>

            {/* Caso 2: Colapsado Automático */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Auto-colapso (maxItems: 3)
              </p>
              <Breadcrumb
                maxItems={3}
                items={[
                  { label: 'Dashboard', href: '/' },
                  { label: 'Usuarios', href: '/users' },
                  { label: 'Estudiantes', href: '/users/students' },
                  { label: 'Expedientes', href: '/users/students/files' },
                  { label: 'Mariela González' },
                ]}
              />
            </div>

            {/* Caso 3: Separador Custom */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Separador Minimalista
              </p>
              <Breadcrumb
                separator={
                  <span className="text-muted-foreground/30 mx-1">/</span>
                }
                items={[
                  { label: 'Proyectos', href: '/projects' },
                  { label: 'Braaiasao Website' },
                ]}
              />
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Navegación
              </p>
              <Breadcrumb
                separator={
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-zinc-600 font-extralight"
                    strokeWidth={1}
                  />
                }
                items={[
                  { label: 'Inicio', href: '/' },
                  { label: 'Nosotros', href: '/nosotros' },
                  { label: 'Menú', href: '/menu' },
                  { label: 'Ubicaciones', href: '/ubicaciones' },
                  { label: 'Contacto' },
                ]}
                className="font-light tracking-widest text-zinc-400"
              />
            </div>
          </div>
        </SectionWrapper>

        {/* --- SKELETON --- */}
        <SectionWrapper title="Feedback: Skeletons">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ejemplo 1: Card de Usuario Cargando */}
            <div className="p-6 border border-border rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <SkeletonAvatar size="lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              <SkeletonText lines={2} lastLineWidth="1/2" />
              <div className="flex justify-end">
                <SkeletonButton size="sm" width="w-20" />
              </div>
            </div>

            {/* Ejemplo 2: Formulario Cargando */}
            <div className="space-y-4">
              <SkeletonInput />
              <SkeletonInput />
              <SkeletonButton className="w-full" />
            </div>

            {/* Ejemplo 3: List Item Minimalista */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border-b border-border/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        <SectionWrapper title="Interactions: Dialog (Modal)">
          <div className="p-10 border border-border rounded-xl bg-card/20 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Prueba el flujo de edición:
            </p>
            <Button onClick={() => setShowModal(true)}>
              Editar Perfil del Alumno
            </Button>

            <Dialog
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Editar Perfil"
              description="Modifica la información del estudiante. Los cambios se guardarán instantáneamente."
            >
              <div className="p-1 border-2 border-dashed border-border rounded-3xl mt-4">
                <div className="p-2">
                  <ProfileFormExample />
                </div>
              </div>
            </Dialog>
          </div>
        </SectionWrapper>
      </main>

      <footer className="py-20 border-t border-border mt-20">
        <div className="container mx-auto text-center space-y-2">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            mmgonnar Boilerplate v1.0
          </p>
          <p className="text-[10px] text-muted-foreground/60 italic">
            Taxco, Guerrero — 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
