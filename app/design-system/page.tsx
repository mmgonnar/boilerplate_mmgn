'use client';

import { useState } from 'react';

import {
  LoginFormExample,
  ProfileFormExample,
} from '@/components/design-system';
import { SectionWrapper } from '@/components/design-system/section-wrapper';
import { Badge, Button, Input, ThemeToggle } from '@/components/ui';
import {
  Building,
  Check,
  ChevronLeft,
  Clock,
  ExternalLink,
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

// 'use client';

// import { useState } from 'react';

// import {
//   LoginFormExample,
//   ProfileFormExample,
//   SectionWrapper,
// } from '@/components/design-system';
// import BadgeDesignSection from '@/components/design-system/badge-design-section';
// import { Badge, Button, Input, ThemeToggle } from '@/components/ui';
// import {
//   BadgeCheckIcon,
//   ChevronLeft,
//   ExternalLink,
//   Mail,
//   Plus,
//   Save,
//   Search,
//   ShieldCheck,
//   Star,
//   Trash2,
// } from 'lucide-react';

// export default function DesignSystemPage() {
//   const [loading, setLoading] = useState(false);

//   return (
//     <>
//       <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
//         <div className="container mx-auto flex items-center justify-between h-16 px-4">
//           <Button
//             href="/"
//             variant="ghost"
//             size="sm"
//             leftIcon={<ChevronLeft size={16} />}
//           >
//             Regresar
//           </Button>
//           <div className="flex items-center gap-4">
//             <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
//               Probar Temas:
//             </span>
//             <ThemeToggle />
//           </div>
//         </div>
//       </nav>

//       {/* ✅ tokens en lugar de colores hardcodeados */}
//       <main className="p-10 space-y-12 bg-background min-h-screen">
//         <header className="border-b border-border pb-8">
//           <h1 className="text-4xl font-bold text-foreground">Design System</h1>
//           <p className="text-muted-foreground mt-2">
//             Guía de estilos y componentes para boilerplate.
//           </p>
//         </header>

//         <section>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Theme Toggle
//           </h2>
//           <div className="flex items-center gap-4">
//             <ThemeToggle />
//             <span className="text-sm text-muted-foreground">
//               Cambia entre modo claro y oscuro
//             </span>
//           </div>
//         </section>

//         <section>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Botones: Variantes
//           </h2>
//           <div className="flex flex-wrap gap-4">
//             <Button>Primary</Button>
//             <Button variant="secondary">Secondary</Button>
//             <Button variant="outline">Outline</Button>
//             <Button variant="ghost">Ghost</Button>
//             <Button variant="danger">Danger</Button>
//           </div>
//         </section>

//         <section>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Botones: Estados y Carga
//           </h2>
//           <div className="flex flex-wrap gap-4 items-center">
//             <Button
//               onClick={() => {
//                 setLoading(true);
//                 setTimeout(() => setLoading(false), 2000);
//               }}
//               isLoading={loading}
//               leftIcon={<Save size={18} />}
//             >
//               {loading ? 'Guardando...' : 'Guardar Cambios'}
//             </Button>
//             <Button isLoading variant="outline">
//               Cargando
//             </Button>
//           </div>
//         </section>

//         <section>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Botones: Como Enlaces (Polimorfismo)
//           </h2>
//           <div className="flex flex-wrap gap-4">
//             <Button
//               href="/dashboard"
//               variant="outline"
//               leftIcon={<Mail size={18} />}
//             >
//               Ir al Dashboard
//             </Button>
//             {/* ✅ target="_blank" eliminado — external ya lo hace */}
//             <Button
//               href="https://github.com/mmgonnar"
//               external
//               variant="ghost"
//               rightIcon={<ExternalLink size={18} />}
//             >
//               Ver GitHub
//             </Button>
//           </div>
//         </section>

//         <section>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Botones: Tamaños e Iconos
//           </h2>
//           <div className="flex flex-wrap gap-4 items-end">
//             <Button size="sm">Pequeño</Button>
//             <Button size="default">Default</Button>
//             <Button size="lg">Grande</Button>
//             <Button size="icon" variant="danger" aria-label="Eliminar">
//               <Trash2 size={18} />
//             </Button>
//             <Button size="icon" className="rounded-full">
//               <Plus size={18} />
//             </Button>
//           </div>
//         </section>

//         <SectionWrapper title="Input Mastery (Todas las Variantes)">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Estados Base */}
//             <div className="space-y-4">
//               <p className="text-[10px] font-bold uppercase text-muted-foreground">
//                 Estados Base
//               </p>
//               <Input label="Default" placeholder="Escribe algo..." />
//               <Input label="Con Valor" defaultValue="mmgonnar" />
//               <Input
//                 label="Deshabilitado"
//                 disabled
//                 value="No puedes editar esto"
//               />
//               <Input
//                 label="Solo Lectura"
//                 readOnly
//                 value="Contenido protegido"
//               />
//             </div>

//             {/* Con Iconos y Ayuda */}
//             <div className="space-y-4">
//               <p className="text-[10px] font-bold uppercase text-muted-foreground">
//                 Iconos y Hints
//               </p>
//               <Input
//                 label="Icono Izquierdo"
//                 leftIcon={<Mail size={16} />}
//                 placeholder="Email"
//               />
//               <Input
//                 label="Icono Derecho"
//                 rightIcon={<Search size={16} />}
//                 placeholder="Buscar..."
//               />
//               <Input
//                 label="Con Ayuda"
//                 hint="La contraseña debe ser alfanumérica."
//                 placeholder="••••••••"
//               />
//             </div>

//             {/* Validaciones y Errores */}
//             <div className="space-y-4">
//               <p className="text-[10px] font-bold uppercase text-muted-foreground">
//                 Feedback de Validación
//               </p>
//               <Input
//                 label="Estado de Error"
//                 error="Este campo es obligatorio"
//                 placeholder="Error visible"
//               />
//               <Input
//                 label="Requerido"
//                 required
//                 placeholder="Tiene un asterisco"
//               />
//               <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
//                 <p className="text-[10px] text-emerald-600 font-bold mb-2 uppercase">
//                   Input en contexto de éxito
//                 </p>
//                 <Input
//                   placeholder="Todo correcto"
//                   className="border-emerald-500 focus-visible:ring-emerald-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </SectionWrapper>

//         <section className="space-y-6">
//           <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
//             — Inputs
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
//             <Input label="Nombre de usuario" placeholder="@mmgonnar" />
//             <Input
//               label="Correo Electrónico"
//               placeholder="tu@email.com"
//               leftIcon={<Mail size={16} />}
//               hint="Nunca compartiremos tu correo."
//             />
//             <Input
//               label="Contraseña"
//               type="password"
//               error="La contraseña debe tener al menos 8 caracteres"
//               defaultValue="123"
//             />
//             <Input label="ID de Estudiante" disabled defaultValue="2025-001" />
//           </div>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
//             — Búsqueda y Filtros
//           </h2>
//           <div className="flex gap-2 max-w-xl">
//             <Input
//               placeholder="Buscar estudiantes..."
//               leftIcon={<Search size={18} className="text-muted-foreground" />}
//             />
//             <Button variant="secondary" className="px-6">
//               Buscar
//             </Button>
//           </div>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
//             — Grupos de Acción
//           </h2>
//           {/* ✅ bg-card reemplazado por bg-background hasta añadir el token */}
//           <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-background">
//             <Button variant="outline" size="sm">
//               Cancelar
//             </Button>
//             <Button size="sm">Guardar Cambios</Button>
//             <div className="flex-1" />
//             <Button variant="danger" size="icon" aria-label="Eliminar">
//               <Trash2 size={16} />
//             </Button>
//           </div>
//         </section>
//         <section className="py-12 px-6 border-2 border-dashed border-border rounded-3xl text-center space-y-4">
//           <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
//             <Plus size={24} className="text-muted-foreground" />
//           </div>
//           <div className="space-y-1">
//             <h3 className="text-lg font-semibold text-foreground">
//               No hay proyectos activos
//             </h3>
//             <p className="text-sm text-muted-foreground max-w-xs mx-auto">
//               Comienza creando tu primer proyecto de gestión o importa uno desde
//               tu dashboard.
//             </p>
//           </div>
//           <Button leftIcon={<Plus size={18} />}>Crear Proyecto</Button>
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
//             — Validación de Formulario
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border border-destructive/20 rounded-xl bg-destructive/5">
//             <Input
//               label="Nueva Contraseña"
//               type="password"
//               defaultValue="short"
//               error="La contraseña es demasiado corta (mínimo 8 caracteres)"
//             />
//             <Input
//               label="Confirmar Contraseña"
//               type="password"
//               error="Las contraseñas no coinciden"
//             />
//           </div>
//         </section>

//         <section className="py-12 px-6 border-2 border-dashed border-border rounded-3xl text-center space-y-4">
//           <LoginFormExample />
//         </section>
//         <section className="py-12 px-6 border-2 border-dashed border-border rounded-3xl text-center space-y-4">
//           <ProfileFormExample />
//         </section>

//         <section className="space-y-4">
//           <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
//             — Badges
//           </h2>
//           {/* // Variantes base */}
//           <Badge>Default</Badge>
//           <Badge variant="success">Activo</Badge>
//           <Badge variant="warning">Pendiente</Badge>
//           <Badge variant="danger">Error</Badge>
//           <Badge variant="outline">Outline</Badge>
//           <Badge variant="ghost">Ghost</Badge>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Con dot de estado (indicadores en tiempo real)
//           </h2>
//           <Badge variant="success" dot>
//             En línea
//           </Badge>
//           <Badge variant="warning" dot>
//             Ausente
//           </Badge>
//           <Badge variant="danger" dot>
//             Desconectado
//           </Badge>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Con iconos
//           </h2>
//           <Badge variant="default" leftIcon={<Star className="h-3 w-3" />}>
//             Destacado
//           </Badge>
//           <h2 className="text-sm font-mono text-muted-foreground mb-6 uppercase tracking-widest">
//             — Tamaños
//           </h2>
//           <Badge size="sm">Pequeño</Badge>
//           <Badge size="default">Default</Badge>
//           <Badge size="lg">Grande</Badge>
//           {/* // Caso de uso real — tabla de usuarios */}
//           <Badge variant="success" dot size="sm">
//             Activo
//           </Badge>
//           <Badge variant="ghost" size="sm">
//             Inactivo
//           </Badge>
//         </section>

//         <section className="space-y-8">
//           <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
//             — Badges & Indicators
//           </h2>

//           {/* Grid para organizar las sub-secciones */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//             {/* Columna 1: Variantes y Estados */}
//             <div className="space-y-6">
//               <div className="space-y-3">
//                 <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
//                   Variantes Base
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   <Badge>Default</Badge>
//                   <Badge variant="secondary">Secondary</Badge>
//                   <Badge variant="outline">Outline</Badge>
//                   <Badge variant="ghost">Ghost</Badge>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
//                   Semántica y Dot
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   <Badge variant="success" dot>
//                     Activo
//                   </Badge>
//                   <Badge variant="warning" dot>
//                     Pendiente
//                   </Badge>
//                   <Badge variant="danger" dot>
//                     Error
//                   </Badge>
//                 </div>
//               </div>
//             </div>

//             {/* Columna 2: Tamaños e Iconos */}
//             <div className="space-y-6">
//               <div className="space-y-3">
//                 <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
//                   Tamaños
//                 </p>
//                 <div className="flex flex-wrap items-end gap-2">
//                   <Badge size="sm">Pequeño</Badge>
//                   <Badge size="default">Default</Badge>
//                   <Badge size="lg">Grande</Badge>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
//                   Con Iconos
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   <Badge
//                     variant="default"
//                     leftIcon={<Star className="h-3 w-3 fill-current" />}
//                   >
//                     Destacado
//                   </Badge>
//                   <Badge
//                     variant="secondary"
//                     rightIcon={<ShieldCheck size={12} />}
//                   >
//                     Verificado
//                   </Badge>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sección de Caso de Uso Real */}
//           <div className="p-6 border border-border rounded-xl bg-card/20 space-y-4">
//             <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">
//               Ejemplo de uso: Tabla de Usuarios
//             </p>
//             <div className="flex items-center gap-6 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="h-8 w-8 rounded-full bg-primary/20" />
//                 <span className="font-medium">Mariela Gonzalez</span>
//               </div>
//               <Badge variant="success" dot size="sm">
//                 Activo
//               </Badge>
//               <Badge variant="outline" size="sm">
//                 Admin
//               </Badge>
//               <span className="text-muted-foreground text-xs italic">
//                 hace 2 min
//               </span>
//             </div>
//           </div>
//         </section>
//         <BadgeDesignSection />
//       </main>
//     </>
//   );
// }
