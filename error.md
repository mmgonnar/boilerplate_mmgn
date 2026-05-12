'use client';

import { useLocale, usePathname, useRouter } from 'next-intl/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Globe, Check } from 'lucide-react';

import { Button } from './button';

const LOCALES = [
{ code: 'es', flag: '🇪🇸', name: 'Español' },
{ code: 'en', flag: '🇬🇧', name: 'English' },
] as const;

export function LanguageToggle() {
const router = useRouter();
const pathname = usePathname();
const locale = useLocale();
const [isOpen, setIsOpen] = useState(false);
const [mounted, setMounted] = useState(false);

useEffect(() => setMounted(true), []);

useEffect(() => {
const handleClickOutside = () => setIsOpen(false);
if (isOpen) {
document.addEventListener('click', handleClickOutside);
return () => document.removeEventListener('click', handleClickOutside);
}
}, [isOpen]);

if (!mounted) {
return (
<Button variant="ghost" size="icon" disabled className="opacity-0" />
);
}

const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

const handleLocaleChange = (newLocale: string) => {
router.replace(pathname, { locale: newLocale });
setIsOpen(false);
};

return (
<div className="relative">
<Button
variant="ghost"
size="icon"
onClick={(e) => {
e.stopPropagation();
setIsOpen(!isOpen);
}}
aria-label="Cambiar idioma"
aria-expanded={isOpen}
aria-haspopup="listbox" >
<span className="text-base">{currentLocale.flag}</span>
</Button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full mt-1 z-50',
            'min-w-[140px] py-1',
            'bg-background border border-border rounded-md shadow-lg',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring',
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
                locale === loc.code && 'bg-accent',
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
