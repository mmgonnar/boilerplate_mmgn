'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  XIcon,
} from './social-media-icons';

// ─── Types ────────────────────────────────────────────────────────────────────
type IconVariant = 'brand' | 'white';

interface SocialItem {
  name: string;
  href: string;
  Icon: React.FC<{ className?: string; variant?: IconVariant }>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SOCIAL_DATA: SocialItem[] = [
  { name: 'GitHub', href: 'https://github.com/mmgonnar', Icon: GithubIcon },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/mmgonnar',
    Icon: LinkedinIcon,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/mmgonnar',
    Icon: InstagramIcon,
  },
  { name: 'X', href: 'https://x.com/mmgonnar', Icon: XIcon },
  { name: 'Email', href: 'mailto:contacto@mmgonnar.com', Icon: MailIcon },
];

// ─── Subcomponent ─────────────────────────────────────────────────────────────
function SocialIcon({ item, isDark }: { item: SocialItem; isDark: boolean }) {
  // Si isDark es true, enviamos 'white'. Si es false, enviamos 'brand' (gradiente).
  const variant: IconVariant = isDark ? 'white' : 'brand';

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center p-2 rounded-full transition-all duration-300',
        isDark ? 'hover:bg-white/10' : 'hover:bg-black/5',
      )}
    >
      <item.Icon className="w-5 h-5 shrink-0" variant={variant} />
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface SocialMediaProps {
  className?: string;
}

export function SocialMedia({ className }: SocialMediaProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <nav
      className={cn('flex items-center gap-2', className)}
      aria-label="Social media links"
    >
      {SOCIAL_DATA.map((item) => (
        <SocialIcon key={item.name} item={item} isDark={isDark} />
      ))}
    </nav>
  );
}
