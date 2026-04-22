import { NavConfig } from '../types/types';

export const NAV_CONFIG: NavConfig = {
  public: [
    { label: 'Inicio', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
  ],
  authenticated: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Perfil', href: '/profile' },
  ],
};
