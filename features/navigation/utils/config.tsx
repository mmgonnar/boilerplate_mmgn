import { NavConfig } from '../types/types';

export const NAV_CONFIG: NavConfig = {
  public: [
    { label: 'home', href: '/', isFooter: false },
    { label: 'features', href: '/features', isFooter: true},
    { label: 'pricing', href: '/pricing', isFooter: true },
    { label: 'about', href: '/about' },
  ],
  authenticated: [
    { label: 'dashboard', href: '/dashboard' },
    { label: 'profile', href: '/profile' },
  ],
};
