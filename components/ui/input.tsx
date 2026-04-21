'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  label?: string;
  error?: string;
  hint?: string; // texto de ayuda bajo el input
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Componente ───────────────────────────────────────────────────────────────
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
    // ✅ id estable para conectar label + input + mensaje de error (accesibilidad)
    const inputId = id ?? React.useId();
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    // ✅ construye aria-describedby solo con los ids que existen en el DOM
    const describedBy =
      [error ? errorId : null, hint ? hintId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div className="flex w-full flex-col gap-1.5 text-left">
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

        {/* Input wrapper — necesario para posicionar iconos */}
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
              // ── Transición ────────────────────────────────────────────────
              'transition-[border-color,box-shadow] duration-200',
              // ── Disabled ──────────────────────────────────────────────────
              'disabled:cursor-not-allowed disabled:opacity-50',
              // ── Error ─────────────────────────────────────────────────────
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'focus-visible:ring-ring',
              // ── Padding dinámico según iconos ─────────────────────────────
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

        {/* Error — tiene prioridad sobre hint */}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        {/* Hint — solo si no hay error */}
        {!error && hint && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
