import * as React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

// ─── Variantes ────────────────────────────────────────────────────────────────
const skeletonVariants = cva('animate-pulse bg-muted rounded-md shrink-0', {
  variants: {
    variant: {
      default: 'bg-muted',
      card: 'bg-muted/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface SkeletonProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

// ─── Skeleton base ────────────────────────────────────────────────────────────
// Bloque genérico — base de todos los demás
function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, className }))}
      aria-hidden="true" // ✅ invisible para screen readers — no es contenido real
      {...props}
    />
  );
}
Skeleton.displayName = 'Skeleton';

// ─── SkeletonText ─────────────────────────────────────────────────────────────
// Simula líneas de texto con ancho variable para verse natural
interface SkeletonTextProps extends SkeletonProps {
  lines?: number; // cantidad de líneas
  lastLineWidth?: 'full' | '3/4' | '1/2' | '1/3'; // última línea más corta = natural
}

function SkeletonText({
  lines = 3,
  lastLineWidth = '3/4',
  className,
  variant,
  ...props
}: SkeletonTextProps) {
  const widthMap = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant={variant}
          className={cn(
            'h-4',
            i === lines - 1 ? widthMap[lastLineWidth] : 'w-full',
          )}
          {...props}
        />
      ))}
    </div>
  );
}
SkeletonText.displayName = 'SkeletonText';

// ─── SkeletonAvatar ───────────────────────────────────────────────────────────
interface SkeletonAvatarProps extends SkeletonProps {
  size?: 'sm' | 'default' | 'lg';
}

function SkeletonAvatar({
  size = 'default',
  className,
  variant,
  ...props
}: SkeletonAvatarProps) {
  const sizeMap = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  return (
    <Skeleton
      variant={variant}
      className={cn('rounded-full shrink-0', sizeMap[size], className)}
      {...props}
    />
  );
}
SkeletonAvatar.displayName = 'SkeletonAvatar';

// ─── SkeletonButton ───────────────────────────────────────────────────────────
interface SkeletonButtonProps extends SkeletonProps {
  size?: 'sm' | 'default' | 'lg' | 'icon';
  width?: string; // ancho custom ej: 'w-32'
}

function SkeletonButton({
  size = 'default',
  width,
  className,
  variant,
  ...props
}: SkeletonButtonProps) {
  const sizeMap = {
    sm: 'h-9',
    default: 'h-10',
    lg: 'h-11',
    icon: 'h-10 w-10',
  };

  return (
    <Skeleton
      variant={variant}
      className={cn(
        sizeMap[size],
        size !== 'icon' && (width ?? 'w-24'), // ancho default si no es icon
        'rounded-md',
        className,
      )}
      {...props}
    />
  );
}
SkeletonButton.displayName = 'SkeletonButton';

// ─── SkeletonInput ────────────────────────────────────────────────────────────
function SkeletonInput({ className, variant, ...props }: SkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} aria-hidden="true">
      <Skeleton variant={variant} className="h-4 w-1/4" /> {/* label */}
      <Skeleton variant={variant} className="h-10 w-full rounded-md" />{' '}
      {/* input */}
    </div>
  );
}
SkeletonInput.displayName = 'SkeletonInput';

// ─── SkeletonCard ─────────────────────────────────────────────────────────────
// Simula una card completa con header, contenido y footer
interface SkeletonCardProps extends SkeletonProps {
  showFooter?: boolean;
  showImage?: boolean;
  imageHeight?: string; // ej: 'h-40'
}

function SkeletonCard({
  showFooter = true,
  showImage = false,
  imageHeight = 'h-40',
  className,
  variant,
  ...props
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 space-y-4',
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {/* Imagen opcional — full bleed */}
      {showImage && (
        <Skeleton
          variant={variant}
          className={cn(
            'w-full rounded-lg -mx-6 -mt-6 rounded-b-none',
            imageHeight,
          )}
          style={{ width: 'calc(100% + 3rem)' }}
        />
      )}

      {/* Header — avatar + título */}
      <div className="flex items-center gap-3">
        <SkeletonAvatar variant={variant} />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton variant={variant} className="h-4 w-1/2" />
          <Skeleton variant={variant} className="h-3 w-1/3" />
        </div>
      </div>

      {/* Contenido */}
      <SkeletonText lines={3} variant={variant} />

      {/* Footer */}
      {showFooter && (
        <div className="flex items-center gap-2 pt-2">
          <SkeletonButton variant={variant} />
          <SkeletonButton variant={variant} width="w-20" />
        </div>
      )}
    </div>
  );
}
SkeletonCard.displayName = 'SkeletonCard';

// ─── SkeletonTable ────────────────────────────────────────────────────────────
interface SkeletonTableProps extends SkeletonProps {
  rows?: number;
  columns?: number;
}

function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  variant,
  ...props
}: SkeletonTableProps) {
  return (
    <div
      className={cn('w-full space-y-3', className)}
      aria-hidden="true"
      {...props}
    >
      {/* Header */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant={variant} className="h-4 w-3/4" />
        ))}
      </div>
      <Skeleton variant={variant} className="h-px w-full" /> {/* divisor */}
      {/* Filas */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              variant={variant}
              // ✅ anchos variados para verse más natural
              className={cn('h-4', colIndex === 0 ? 'w-3/4' : 'w-full')}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
SkeletonTable.displayName = 'SkeletonTable';

// ─── Exports ──────────────────────────────────────────────────────────────────
export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonCard,
  SkeletonTable,
};
