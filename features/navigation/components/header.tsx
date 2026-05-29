'use client';

import * as React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Logo } from '@/components';
import { Avatar, Button, LanguageToggle, ThemeToggle } from '@/components/ui';
import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { LogOut, Menu, X } from 'lucide-react';

import { NavLink } from '../types/types';
import { NAV_CONFIG } from '../utils/config';

// ─── Interfaces de Props (Estandarizadas con Type) ───────────────────────────
type HeaderProps = {
  isAuthenticated?: boolean;
  customActions?: React.ReactNode;
};

type NavLinksProps = {
  links: NavLink[];
  pathname: string;
  t: (key: string) => string;
  mobile?: boolean;
};

type HeaderActionsProps = {
  isAuthenticated: boolean;
  t: (key: string) => string;
};

type HeaderDashboardProps = {
  userEmail?: string;
  userSrc?: string;
  createdAt?: string;
  lastSignInAt?: string;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
};

// ─── Subcomponentes Compartidos ───────────────────────────────────────────────
function NavLinks({ links, pathname, t, mobile = false }: NavLinksProps) {
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'rounded-md text-sm transition-colors duration-150',
            'hover:text-foreground hover:bg-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            mobile ? 'px-3 py-2.5' : 'px-3 py-2',
            pathname === link.href
              ? 'text-foreground font-medium bg-accent'
              : 'text-muted-foreground',
          )}
          aria-current={pathname === link.href ? 'page' : undefined}
        >
          {t(link.label)}
        </Link>
      ))}
    </>
  );
}

function HeaderActions({ isAuthenticated, t }: HeaderActionsProps) {
  const { user } = useAuth();

  if (isAuthenticated && user) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label={t('profile')}
      >
        <Avatar
          src={user.user_metadata?.avatar_url}
          fallbackText={user.email}
          size="sm"
        />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" href="/login">
        {t('login')}
      </Button>
      <Button size="sm" href="/register">
        {t('register')}
      </Button>
    </div>
  );
}

function MobileActions({ isAuthenticated, t }: HeaderActionsProps) {
  if (isAuthenticated) {
    return (
      <Button variant="outline" size="sm" className="w-full">
        {t('profile')}
      </Button>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" href="/login" className="w-full">
        {t('login')}
      </Button>
      <Button size="sm" href="/register" className="w-full">
        {t('register')}
      </Button>
    </>
  );
}

// ─── (Landing/Web) ─────────────────────
export function Header({
  isAuthenticated = false,
  customActions,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const t = useTranslations('nav');

  const navLinks = isAuthenticated
    ? NAV_CONFIG.authenticated
    : NAV_CONFIG.public;

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md"
      role="navigation"
      aria-label="Primary"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Primary navigation"
        >
          <NavLinks links={navLinks} pathname={pathname} t={t} />
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />

          {customActions ? (
            customActions
          ) : (
            <HeaderActions isAuthenticated={isAuthenticated} t={t} />
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t('close_menu') : t('open_menu')}
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

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden border-t border-border bg-background overflow-hidden',
          'transition-[max-height,opacity] duration-300',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          <NavLinks links={navLinks} pathname={pathname} t={t} mobile />

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
            <span className="text-sm font-medium">{t('language')}</span>
            <div>
              <LanguageToggle mobile />
            </div>
            <MobileActions isAuthenticated={isAuthenticated} t={t} />
          </div>
        </nav>
      </div>
    </header>
  );
}

// ─── (Dashboard) ─────────────
export function HeaderDashboard({
  userEmail,
  userSrc,
  onLogout,
  isLoggingOut,
}: HeaderDashboardProps) {
  return (
    <header className="flex justify-between items-center p-4 border-b border-border bg-card">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Dashboard
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 max-w-[240px] select-none">
          <Avatar src={userSrc} fallbackText={userEmail} size="sm" />
          {userEmail && (
            <span className="text-sm truncate text-muted-foreground hidden sm:inline">
              {userEmail}
            </span>
          )}
        </div>

        <div className="h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          leftIcon={<LogOut className="h-4 w-4" />}
        >
          <span className="hidden sm:inline">
            {isLoggingOut ? 'Leaving...' : 'Logout'}
          </span>
        </Button>
      </div>
    </header>
  );
}

// ─── (Auth) ────────────
export function HeaderAuth() {
  return (
    <header
      role="navigation"
      aria-label="Auth Primary"
      className="flex h-16 items-center justify-between px-10 border-b border-border bg-background"
    >
      <Logo />
      <div className="flex gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
}
