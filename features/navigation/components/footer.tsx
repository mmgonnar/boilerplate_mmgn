import Link from 'next/link';

import { Logo } from '@/components';
import { cn } from '@/lib/utils';

const FOOTER_LINKS = [
  {
    title: 'Producto',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Compañía',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacy' },
      { label: 'Términos', href: '/terms' },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* ── Grid principal ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Boilerplate production-ready para arrancar proyectos.
            </p>
          </div>

          {/* Links por columna */}
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'text-sm text-muted-foreground',
                        'transition-colors duration-150 hover:text-foreground',
                        'focus-visible:outline-none focus-visible:ring-2',
                        'focus-visible:ring-ring rounded-sm',
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {currentYear} mmgonnar - boilerplate. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho por:{' '}
            <Link
              href="https://github.com/mmgonnar"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              mmgonnar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
