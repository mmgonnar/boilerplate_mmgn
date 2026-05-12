import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Logo } from '@/components';
import { cn } from '@/lib/utils';

import { FOOTER_LINKS } from '../utils/config';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FooterColumnType {
  title: string;
  links: { label: string; href: string }[];
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm text-muted-foreground',
        'transition-colors duration-150 hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring rounded-sm',
      )}
    >
      {children}
    </Link>
  );
}

function FooterColumn({
  title,
  links,
  t,
}: FooterColumnType & { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{t(title)}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <FooterLink href={link.href}>{t(link.label)}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Copyright({
  company = 'mmgonnar',
  project = 'boilerplate',
  t,
}: {
  company?: string;
  project?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <p className="text-xs text-muted-foreground">
      © {currentYear} {company} - {project}. {t('copyright')}
    </p>
  );
}

function MadeBy({
  company = 'mmgonnar',
  githubUrl = 'https://github.com/mmgonnar',
  t,
}: {
  company?: string;
  githubUrl?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <p className="text-xs text-muted-foreground">
      {t('made_by')}:{' '}
      <Link
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        {company}
      </Link>
    </p>
  );
}

function FooterBottom({
  company,
  project,
  githubUrl,
  t,
}: {
  company?: string;
  project?: string;
  githubUrl?: string;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
      <Copyright company={company} project={project} t={t} />
      <MadeBy company={company} githubUrl={githubUrl} t={t} />
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
  const t = useTranslations('nav');

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer_brand')}
            </p>
          </div>

          {FOOTER_LINKS.map((column) => (
            <nav key={column.title} aria-label={t(column.title)}>
              <FooterColumn title={column.title} links={column.links} t={t} />
            </nav>
          ))}
        </div>

        <FooterBottom t={t} />
      </div>
    </footer>
  );
}
