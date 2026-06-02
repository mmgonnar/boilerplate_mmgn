import * as React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

// ─── Variantes ────────────────────────────────────────────────────────────────
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full px-2.5 py-0.5',
    'text-xs font-medium',
    'transition-colors duration-200',
    'border',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground border-secondary',
        success:
          'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400',
        warning:
          'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400',
        danger: 'bg-destructive/10 text-destructive border-destructive/20',
        outline: 'bg-transparent text-foreground border-border',
        ghost: 'bg-muted text-muted-foreground border-transparent',
      },
      size: {
        sm: 'px-2 py-0 text-[10px]',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────
export type BadgeProps = {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dot?: boolean; // ✅ indicador de estado tipo •
} & React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

// ─── Componente ───────────────────────────────────────────────────────────────
function Badge({
  className,
  variant,
  size,
  leftIcon,
  rightIcon,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {/* Dot de estado */}
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0',
            // hereda el color del texto del badge
            'bg-current',
          )}
          aria-hidden="true"
        />
      )}

      {/* Icono izquierdo */}
      {leftIcon && !dot && (
        <span className="shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {children}

      {/* Icono derecho */}
      {rightIcon && (
        <span className="shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </span>
  );
}

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
