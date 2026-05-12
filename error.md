'use client';

import \* as React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components';
import { Button, ThemeToggle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Globe, Menu, X } from 'lucide-react';

import type { NavLink } from '@/features/navigation/types/types';
import { NAV_CONFIG } from '@/features/navigation/utils/config';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeaderProps {
isAuthenticated?: boolean;
}

interface NavLinksProps {
links: NavLink[];
pathname: string;
t: ReturnType<typeof useTranslations>;
mobile?: boolean;
}

interface HeaderActionsProps {
isAuthenticated: boolean;
t: ReturnType<typeof useTranslations>;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

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
aria-current={pathname === link.href ? 'page' : undefined} >
{t(link.label)}
</Link>
))}
</>
);
}

function HeaderActions({ isAuthenticated, t }: HeaderActionsProps) {
if (isAuthenticated) {
return (
<Button variant="ghost" size="icon" aria-label={t('profile')}>
<div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
<span className="text-xs font-medium text-primary">U</span>
</div>
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

// ─── Header ───────────────────────────────────────────────────────────────────
export function Header({ isAuthenticated = false }: HeaderProps) {
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
<header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
{/_ ── Desktop bar ─────────────────────────────────────────────────── _/}
<div className="container mx-auto flex h-16 items-center justify-between px-4">
<Logo />

        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Primary navigation"
        >
          <NavLinks links={navLinks} pathname={pathname} t={t} />
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label={t('language')}>
            <Globe className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <HeaderActions isAuthenticated={isAuthenticated} t={t} />
        </div>

        {/* ── Hamburger ───────────────────────────────────────────────── */}
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

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
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
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              leftIcon={<Globe className="h-4 w-4" />}
              aria-label={t('language')}
            >
              {t('language')}
            </Button>
            <MobileActions isAuthenticated={isAuthenticated} t={t} />
          </div>
        </nav>
      </div>
    </header>

);
}
