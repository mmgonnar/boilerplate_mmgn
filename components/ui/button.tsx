'use client';

import * as React from 'react';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

// ─── Variantes ────────────────────────────────────────────────────────────────
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-md text-sm font-medium cursor-pointer',
    'transition-all duration-200',
    'focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-primary text-primary-foreground hover:bg-primary/90'],
        outline: [
          'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        ],
        ghost: ['text-muted-foreground hover:bg-accent hover:text-foreground'],
        danger: [
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ],
        secondary: [
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ],
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10 shrink-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

// ─── Types ────────────────────────────────────────────────────────────────────

// Props base compartidas entre ambos modos
type BaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
};

// Modo botón normal
type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never; // ✅ nunca acepta href en modo botón
    external?: never;
  };

// Modo link
type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
    external?: boolean; // abre en _blank con rel seguro
  };

// Union type — TypeScript elige el tipo correcto según si href existe
export type ButtonProps = ButtonAsButton | ButtonAsLink;

// ─── Componente ───────────────────────────────────────────────────────────────
const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    // Contenido compartido entre ambos modos
    const content = (
      <>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon && (
            <span className="shrink-0" aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}

        {children && (
          <span className={cn(isLoading && size === 'icon' && 'sr-only')}>
            {children}
          </span>
        )}

        {!isLoading && rightIcon && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );

    // ── Modo Link ──────────────────────────────────────────────────────────
    if ('href' in props && props.href !== undefined) {
      const { href, external, ...linkProps } = props as ButtonAsLink;

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined} // ✅ seguridad
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    // ── Modo Button ────────────────────────────────────────────────────────
    const { disabled, ...buttonProps } = props as ButtonAsButton;
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...buttonProps}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
