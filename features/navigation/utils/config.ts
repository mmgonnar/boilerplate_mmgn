import type { NavConfig } from '../types/types';

interface FooterColumnType {
  title: string;
  links: { label: string; href: string }[];
}

export const NAV_CONFIG: NavConfig = {
  public: [
    { label: 'home', href: '/' },
    { label: 'features', href: '/features' },
    { label: 'pricing', href: '/pricing' },
    { label: 'about', href: '/about' },
  ],
  authenticated: [
    { label: 'dashboard', href: '/dashboard' },
    { label: 'profile', href: '/profile' },
  ],
};

export const FOOTER_LINKS: FooterColumnType[] = [
  {
    title: 'product',
    links: [
      { label: 'features', href: '/features' },
      { label: 'pricing', href: '/pricing' },
      { label: 'changelog', href: '/changelog' },
    ],
  },
  {
    title: 'company',
    links: [
      { label: 'about', href: '/about' },
      { label: 'blog', href: '/blog' },
      { label: 'careers', href: '/careers' },
    ],
  },
  {
    title: 'legal',
    links: [
      { label: 'privacy', href: '/privacy' },
      { label: 'terms', href: '/terms' },
    ],
  },
];