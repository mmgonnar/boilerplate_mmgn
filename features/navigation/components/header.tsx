'use client';

import * as React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components';
import { Button, ThemeToggle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Globe, Menu, X } from 'lucide-react';

import { NAV_CONFIG } from '@/features/navigation/utils/config';

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeaderProps {
  isAuthenticated?: boolean; // ← vendrá de Supabase Auth cuando lo conectemos
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function Header({ isAuthenticated = false }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const t = useTranslations('nav');

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = isAuthenticated
    ? NAV_CONFIG.authenticated
    : NAV_CONFIG.public;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* ── Logo ────────────────────────────────────────────────────── */}
        <Logo />

        {/* ── Navegación central — desktop ────────────────────────────── */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 rounded-md text-sm transition-colors duration-150',
                'hover:text-foreground hover:bg-accent',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                pathname === link.href
                  ? 'text-foreground font-medium bg-accent'
                  : 'text-muted-foreground',
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* ── Acciones — desktop ──────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-2">
          {/* i18n — preparado, sin lógica aún */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cambiar idioma"
            title="Cambiar idioma (próximamente)"
          >
            <Globe className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          {isAuthenticated ? (
            // ✅ Avatar placeholder — se reemplaza con el componente Avatar
            // cuando conectemos Supabase Auth
            <Button variant="ghost" size="icon" aria-label="Perfil de usuario">
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">U</span>
              </div>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" href="/login">
                {t('login')}
              </Button>
              <Button size="sm" href="/register">
                {t('register')}
              </Button>
            </div>
          )}
        </div>

        {/* ── Hamburger — mobile ──────────────────────────────────────── */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* ── Menú mobile ─────────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden border-t border-border bg-background',
          'transition-[max-height,opacity] duration-300 overflow-hidden',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Navegación mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2.5 rounded-md text-sm transition-colors duration-150',
                'hover:text-foreground hover:bg-accent',
                pathname === link.href
                  ? 'text-foreground font-medium bg-accent'
                  : 'text-muted-foreground',
              )}
              aria-current={pathname === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}

          {/* Acciones mobile */}
          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              aria-label="Cambiar idioma"
            >
              <Globe className="h-4 w-4" />
              {t('language')}
            </Button>

            {isAuthenticated ? (
              <Button variant="outline" size="sm" className="w-full">
                Mi perfil
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  href="/login"
                  className="w-full"
                >
                  Iniciar sesión
                </Button>
                <Button size="sm" href="/register" className="w-full">
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
