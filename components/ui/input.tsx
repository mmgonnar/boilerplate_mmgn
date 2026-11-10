'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export type InputProps = {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
>

// ─── Component ───────────────────────────────────────────────────────────────
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const describedBy =
      [error ? errorId : null, hint ? hintId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      /* pb-5 reserves the exact height the absolutely positioned text will
        take (14px of text plus margin), which keeps the layout from jumping
        and stops it overlapping the next input.
      */
      <div className="relative flex w-full flex-col gap-1.5 text-left pb-1">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {label}
            {props.required && (
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Icono izquierdo */}
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-muted-foreground">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              // ── Base ──────────────────────────────────────────────────────
              'flex h-10 w-full rounded-md border border-border bg-background',
              'px-3 py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              // ── Focus ─────────────────────────────────────────────────────
              'outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              // ── Transition ─────────────────────────────────────────────────
              'transition-[border-color,box-shadow] duration-200',
              // ── Disabled ──────────────────────────────────────────────────
              'disabled:cursor-not-allowed disabled:opacity-50',
              // ── Error ─────────────────────────────────────────────────────
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'focus-visible:ring-ring',
              // ── Dynamic padding based on icons ─────────────────────────────
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className,
            )}
            {...props}
          />

          {/* Icono derecho */}
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 text-muted-foreground">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Absolute feedback container:
          pinned to `bottom-0` so it never pushes the DOM around.
        */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="absolute -bottom-4 left-0 text-xs font-medium text-destructive transition-all duration-200"
          >
            {error}
          </p>
        )}

        {!error && hint && (
          <p
            id={hintId}
            className="absolute -bottom-4 left-0 text-xs text-muted-foreground transition-all duration-200"
          >
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
