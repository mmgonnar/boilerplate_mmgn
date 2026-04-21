import { Badge } from '@/components/ui/badge';
import { Check, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function BadgeDesignSection() {
  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
          — Badges & Status
        </h2>
      </header>

      <div className="space-y-6">
        {/* Variantes por Propósito */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">
            Variantes Semánticas
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success" dot>
              Active
            </Badge>
            <Badge variant="warning" dot>
              Pending
            </Badge>
            <Badge variant="danger" dot>
              Error
            </Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="ghost">Ghost</Badge>
          </div>
        </div>

        {/* Tamaños y Composición */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">
            Tamaños e Iconos
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge size="sm" variant="secondary" leftIcon={<Clock size={10} />}>
              History
            </Badge>
            <Badge
              size="default"
              variant="default"
              rightIcon={<Check size={12} />}
            >
              Completed
            </Badge>
            <Badge
              size="lg"
              variant="success"
              leftIcon={<ShieldCheck size={14} />}
            >
              Verified User
            </Badge>
          </div>
        </div>

        {/* Casos de Uso Reales */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">
            Ejemplos de Aplicación
          </p>
          <div className="flex flex-wrap gap-3 p-4 border border-border rounded-xl bg-card/20">
            {/* Para ClassAid: Niveles */}
            <Badge variant="default" className="rounded-md font-bold">
              Nivel A1
            </Badge>
            {/* Para NEKTAR: Stock */}
            <Badge
              variant="success"
              dot
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              In Stock
            </Badge>
            {/* Para Dashboard: Performance */}
            <Badge
              variant="warning"
              leftIcon={<Zap size={12} className="fill-current" />}
            >
              High CPU
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
