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
type ButtonVariant = VariantProps<typeof buttonVariants>;

type BaseButtonProps = {
  className?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
} & ButtonVariant

type ButtonOnlyProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;

type LinkOnlyProps = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ButtonOnlyProps | LinkOnlyProps;

// ─── Componente ────────────────────────────────────────────────────────────────
function Button(
  props: ButtonProps & { ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement> },
) {
  const {
    className,
    variant = 'primary',
    size,
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    ...rest
  } = props;

  const classes = cn(buttonVariants({ variant, size, className }));

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

  if ('href' in rest) {
    const { href, external } = rest as LinkOnlyProps;

    return (
      <Link
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    );
  }

  const { disabled } = rest as ButtonOnlyProps;
  const { type, onClick, ...buttonRest } = rest as ButtonOnlyProps;
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={classes}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      type={type ?? 'button'}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...buttonRest}
    >
      {content}
    </button>
  );
}

Button.displayName = 'Button';

export { Button, buttonVariants };
