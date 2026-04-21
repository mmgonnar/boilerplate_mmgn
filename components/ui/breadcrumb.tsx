import * as React from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string;
  href?: string; // si no tiene href, se renderiza como texto (item activo)
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode; // separador custom
  maxItems?: number; // ✅ colapsa items intermedios si hay muchos
}

// ─── Componente ───────────────────────────────────────────────────────────────
function Breadcrumb({
  items,
  separator,
  maxItems,
  className,
  ...props
}: BreadcrumbProps) {
  // ✅ Lógica de colapso — si hay más items que maxItems, oculta los intermedios
  const shouldCollapse = maxItems && items.length > maxItems;

  const visibleItems = shouldCollapse
    ? [
        items[0], // siempre muestra el primero
        null, // null = placeholder de "..."
        ...items.slice(items.length - (maxItems - 1)), // muestra los últimos
      ]
    : items;

  const separatorNode = separator ?? (
    <ChevronRight
      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
      aria-hidden="true"
    />
  );

  return (
    <nav aria-label="Breadcrumb" className={cn('flex', className)} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;

          // ── Placeholder de colapso ──────────────────────────────────────
          if (item === null) {
            return (
              <React.Fragment key="collapsed">
                <li className="flex items-center">
                  <span
                    className="flex items-center justify-center h-6 w-6 rounded text-muted-foreground"
                    aria-label="Más páginas"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </span>
                </li>
                <li aria-hidden="true" className="flex items-center">
                  {separatorNode}
                </li>
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li className="flex items-center gap-1">
                {/* Item activo — último de la lista, no es link */}
                {isLast ? (
                  <span
                    className={cn(
                      'flex items-center gap-1.5 text-sm font-medium text-foreground',
                    )}
                    aria-current="page"
                  >
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </span>
                ) : // Item navegable — tiene href
                item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 text-sm text-muted-foreground',
                      'transition-colors duration-150',
                      'hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2',
                      'focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm',
                    )}
                  >
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  // Sin href pero tampoco es el último — texto plano
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </span>
                )}
              </li>

              {/* Separador — no se renderiza después del último item */}
              {!isLast && (
                <li aria-hidden="true" className="flex items-center">
                  {separatorNode}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
