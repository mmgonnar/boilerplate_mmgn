'use client';

import { useEffect, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
// ✅ correct source
import { cn } from '@/lib/utils';
import { Check, Globe } from 'lucide-react';

import { Button } from './button';

const LOCALES = [
  { code: 'es', flag: '🇲🇽', name: 'Español' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
] as const;

type LocaleCode = (typeof LOCALES)[number]['code'];

type LanguageToggleProps = {
  mobile?: boolean;
}

export function LanguageToggle({ mobile = false }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (!mounted) {
    return mobile ? (
      <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
    ) : (
      <Button variant="ghost" size="icon" disabled className="opacity-0" />
    );
  }

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const handleLocaleChange = (newLocale: LocaleCode) => {
    // ✅ next-intl createNavigation router handles locale switch natively
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  // ── Mobile variant — full width with text ──────────────────────────────────
  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        {LOCALES.map((loc) => (
          <button
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm',
              'hover:bg-accent hover:text-accent-foreground',
              'transition-colors duration-150',
              locale === loc.code
                ? 'bg-accent text-foreground font-medium'
                : 'text-muted-foreground',
            )}
            role="option"
            aria-selected={locale === loc.code}
          >
            <span>{loc.flag}</span>
            <span className="flex-1 text-left">{loc.name}</span>
            {locale === loc.code && <Check className="h-4 w-4" />}
          </button>
        ))}
      </div>
    );
  }

  // ── Desktop variant — icon + dropdown ─────────────────────────────────────
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('language')}
        aria-expanded={isOpen}
        leftIcon={<Globe size={16} />}
        className={cn('hover:')}
      >
        {currentLocale.name}
      </Button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-1 z-50',
            'min-w-[140px] py-1',
            'bg-background border border-border rounded-md shadow-lg',
          )}
          role="listbox"
          aria-label="Seleccionar idioma"
        >
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleLocaleChange(loc.code)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm',
                'hover:bg-accent hover:text-accent-foreground',
                'transition-colors duration-150',
                locale === loc.code && 'bg-accent text-foreground',
              )}
              role="option"
              aria-selected={locale === loc.code}
            >
              <span>{loc.flag}</span>
              <span className="flex-1 text-left">{loc.name}</span>
              {locale === loc.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
