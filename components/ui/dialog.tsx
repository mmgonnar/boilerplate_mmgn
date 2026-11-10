'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

import { Button } from './button';

// ─── Types ───────────────────────────────────────────────────────────────────
export type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'default' | 'lg' | 'full';
  children: React.ReactNode;
  className?: string;
}

// ─── Sizes ───────────────────────────────────────────────────────────────────
const sizeMap = {
  sm: 'max-w-sm',
  default: 'max-w-lg',
  lg: 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

// ─── Hook: focus trap ─────────────────────────────────────────────────────────
// Traps focus inside the modal while it is open
function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
) {
  React.useEffect(() => {
    if (!isOpen || !ref.current) return;

    const container = ref.current;

    // Focusable elements inside the modal
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // ✅ Cycles focus: shift+tab on the first goes to the last and back
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Foco inicial al primer elemento focusable
    const firstFocusable = getFocusable()[0];
    firstFocusable?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, ref]);
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  size = 'default',
  children,
  className,
}: DialogProps) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false); // ✅ drives the animation
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  // ── Mount on the client only ───────────────────────────────────────────────
  React.useEffect(() => setMounted(true), []);

  // ── Enter and exit animation ───────────────────────────────────────────────
  React.useEffect(() => {
    if (isOpen) {
      // Remember which element had focus before opening
      triggerRef.current = document.activeElement as HTMLElement;
      // Small delay so the CSS animation runs properly
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      // Return focus to the element that opened the modal
      triggerRef.current?.focus();
    }

    return () => {
      // ✅ Safe cleanup, always restores the overflow
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ── Escape key ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ── Focus trap ────────────────────────────────────────────────────────────
  useFocusTrap(dialogRef, isOpen);

  if (!mounted) return null;

  return createPortal(
    <div
      role="presentation"
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        // ✅ pointer-events-none while hidden so it does not swallow clicks
        !isOpen && 'pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm',
          'transition-opacity duration-200',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true" // ✅ tells screen readers the rest is inert
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        className={cn(
          'relative z-50 w-full bg-card border border-border',
          'rounded-2xl p-6 shadow-2xl',
          'transition-[opacity,transform] duration-200',
          visible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2',
          sizeMap[size],
          className,
        )}
      >
        {/* Close button, uses the design system Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4"
          aria-label="Cerrar modal"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        {(title || description) && (
          <div className="space-y-1.5 mb-4 pr-8">
            {title && (
              <h2
                id="dialog-title"
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="dialog-description"
                className="text-sm text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Contenido */}
        <div>{children}</div>
      </div>
    </div>,
    document.body,
  );
}

Dialog.displayName = 'Dialog';
