'use client';

import { useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

import { Button } from './button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled className="opacity-0" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="relative overflow-hidden"
    >
      <Sun
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'h-[1.2rem] w-[1.2rem]',
          'transition-[transform,opacity] duration-300 ease-in-out',
          isDark
            ? '-rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100',
        )}
      />

      <Moon
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          'h-[1.2rem] w-[1.2rem]',
          'transition-[transform,opacity] duration-300 ease-in-out',
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0',
        )}
      />

      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
