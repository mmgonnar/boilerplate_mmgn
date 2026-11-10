import * as React from 'react';

import { Link } from '@/i18n/navigation';

import { cn } from '@/lib/utils';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
export type BreadcrumbItem = {
  label: string;
  href?: string; // without an href it renders as text (the active item)
  icon?: React.ReactNode;
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode; // separador custom
  maxItems?: number; // ✅ collapses the middle items when there are many
} & React.HTMLAttributes<HTMLElement>

// ─── Component ───────────────────────────────────────────────────────────────
function Breadcrumb({
  items,
  separator,
  maxItems,
  className,
  ...props
}: BreadcrumbProps) {
  // ✅ Collapse logic, hides the middle items once there are more than maxItems
  const shouldCollapse = maxItems && items.length > maxItems;

  const visibleItems = shouldCollapse
    ? [
        items[0], // always show the first
        null, // null = the "..." placeholder
        ...items.slice(items.length - (maxItems - 1)), // show the last ones
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

          // ── Collapse placeholder ───────────────────────────────────────────
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
                {/* Active item, last in the list, not a link */}
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
                ) : // Navigable item, it has an href
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
                  // No href and not the last one either, so plain text
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    {item.icon && <span aria-hidden="true">{item.icon}</span>}
                    {item.label}
                  </span>
                )}
              </li>

              {/* Separator, not rendered after the last item */}
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
