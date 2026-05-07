import { NavConfig } from '../types/types';

export const NAV_CONFIG: NavConfig = {
  public: [
    { label: 'home', href: '/' },
    { label: 'features', href: '/features' },
    { label: 'pricing', href: '/pricing' },
    { label: 'about', href: '/about' },
  ],
  authenticated: [
    { label: 'dashboard', href: '/dashboard' },
    { label: 'perfil', href: '/profile' },
  ],
};
