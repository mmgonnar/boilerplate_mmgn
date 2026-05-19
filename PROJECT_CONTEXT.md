# PROJECT_CONTEXT.md

> **Source of Truth** for AI agents and developers working on this repository.
> Generated from architectural audit. Last updated: May 2026.

---

## 1. Technical Stack

### Dependencies

- **Next.js**: 16.2.2 (App Router with Turbopack)
- **React**: 19.2.4
- **TypeScript**: 5.x (strict mode)
- **Bun**: Runtime
- **next-intl**: 3.26.5 ← not v4, downgraded for Next.js 16 compatibility

### Styling

- **Tailwind CSS**: 4.x
- **PostCSS**: 4.x
- **class-variance-authority**: 0.7.1
- **clsx** + **tailwind-merge**: className composition

### Forms

- **react-hook-form**: 7.73.1
- **zod**: 4.3.6
- **@hookform/resolvers**: 5.2.2

### Notifications

- **react-hot-toast**: 2.4.1 — toast notifications with `apiCallToast` helper

### Theming & i18n

- **next-themes**: 0.4.6
- **next-intl**: 4.x
- **lucide-react**: 1.8.0

### Development

- **ESLint**: 9.x
- **Prettier**

---

## 2. Architecture Overview

### Directory Structure

```
/
├── app/                          # Next.js App Router pages
│   ├── [locale]/                 # Locale segment (i18n)
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Authenticated route group
│   │   │   └── dashboard/
│   │   ├── (marketing)/        # Public marketing pages
│   │   │   ├── about/
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   └── page.tsx       # Landing
│   │   ├── design-system/     # Component showcase
│   │   ├── layout.tsx         # Locale layout with providers
│   │   └── page.tsx          # Redirect or 404
│   └── globals.css            # Tailwind v4 theme config
│
│
├── components/
│   ├── assets/                 # Static assets (SVG)
│   ├── design-system/           # Design system demo sections
│   ├── ui/                     # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── skeleton.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── form.tsx
│   │   ├── theme-toggle.tsx
│   │   └── index.ts           # Barrel export
│   ├── index.ts                # Component exports
│   └── logo.tsx                # Logo component (auto dark/light)
│
├── features/                   # Feature-based modules
│   ├── navigation/
│   │   ├── components/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── types/
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   └── config.tsx
│   │   ├── messages/          # Feature translations
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   └── index.ts          # Barrel export
│   ├── auth/
│   │   └── messages/
│   │       ├── en.json
│   │       └── es.json
│   └── dashboard/
│       └── messages/
│           ├── en.json
│           └── es.json
│
├── i18n/                       # Internationalization
│   ├── routing.ts              # defineRouting config
│   └── request.ts             # getRequestConfig
│
├── messages/                   # Root translations
│   ├── en.json
│   └── es.json
│
├── middleware.ts              # Locale detection middleware
│
├── lib/
│   └── utils.ts               # Shared utilities (cn function)
│
├── providers/
│   ├── index.ts
│   └── theme-provider.tsx      # next-themes wrapper
│
├── package.json
├── tsconfig.json
├── next.config.ts             # With next-intl plugin
├── postcss.config.mjs
├── eslint.config.mjs
└── prettierrc
```

### Route Groups

| Group         | Purpose              | Layout                    |
| ------------- | -------------------- | ------------------------- |
| `(auth)`      | Authentication pages | Minimal, centered content |
| `(dashboard)` | Authenticated app    | With sidebar/layout       |
| `(marketing)` | Public marketing     | With Header/Footer        |

---

## 3. Coding Standards

### Component Declaration

```typescript
// 1. Use 'use client' for interactive components
'use client';

import * as React from 'react';

// 2. Import cn from @/lib/utils
import { cn } from '@/lib/utils';

// 3. Import CVA for variants
import { type VariantProps, cva } from 'class-variance-authority';

// 4. Define variants with CVA
const buttonVariants = cva([...baseStyles], {
  variants: {
    variant: { primary: [...], outline: [...] },
    size: { default: [...], sm: [...] },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
});

// 5. Define props extending native HTML + variant props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// 6. Use forwardRef for composition
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />;
  }
);
Button.displayName = 'Button';

// 7. Export both component AND variants
export { Button, buttonVariants };
```

### Naming Conventions

| Type       | Convention | Example                          |
| ---------- | ---------- | -------------------------------- |
| Components | PascalCase | `Button`, `CardHeader`           |
| Files      | kebab-case | `button.tsx`, `card-header.tsx`  |
| Features   | kebab-case | `navigation`, `user-profile`     |
| Types      | PascalCase | `ButtonProps`, `NavLink`         |
| Variants   | camelCase  | `buttonVariants`, `cardVariants` |
| Props      | camelCase  | `className`, `leftIcon`          |

### Import Path Aliases

```typescript
// @/ resolves to project root
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

import { Header } from '@/features/navigation';
```

### Tailwind CSS Pattern

```css
/* globals.css - Tailwind v4 */
@import 'tailwindcss';

@theme {
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
}

@layer base {
  :root {
    --primary: 142 71% 35%;
  }
  .dark {
    /* ... */
  }
}
```

### Dark Mode Integration

All components must use semantic colors:

```typescript
// Correct
className = 'bg-background text-foreground';

// Avoid
className = 'bg-white dark:bg-gray-900';
```

### Subcomponents Pattern

Use subcomponents (private functions) within a parent component to improve readability and organization:

```typescript
// Types - define at top of file
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

// Subcomponents - private, defined before main component
function NavLinks({ links, pathname, t, mobile = false }: NavLinksProps) {
  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href} ...>
          {t(link.label)}
        </Link>
      ))}
    </>
  );
}

function HeaderActions({ isAuthenticated, t }: HeaderActionsProps) {
  // Handle authenticated/unauthenticated states
}

function MobileActions({ isAuthenticated, t }: HeaderActionsProps) {
  // Mobile-specific auth buttons
}

// Main component - uses subcomponents
export function Header({ isAuthenticated = false }: HeaderProps) {
  const t = useTranslations('nav');
  
  return (
    <header>
      <nav><NavLinks ... /></nav>
      <div className="actions">
        <HeaderActions ... />
      </div>
    </header>
  );
}
```

**Benefits:**
- Cleaner main component (10-20 lines instead of 100+)
- Each subcomponent has a single responsibility
- Types co-located with their subcomponent
- Easier to maintain and debug

---

## 4. Component Patterns

### Button Component (`components/ui/button.tsx`)

- Dual mode: `<button>` or `<Link>` based on `href` prop
- Loading state with spinner
- Left/right icons
- Sizes: `default`, `sm`, `lg`, `icon`
- Variants: `primary`, `outline`, `ghost`, `danger`, `secondary`

### Input Component (`components/ui/input.tsx`)

- Label + input + error/hint messages
- Left/right icons
- Full ARIA accessibility

### Card Component (`components/ui/card.tsx`)

- Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardSeparator`
- Variants: `default`, `elevated`, `ghost`, `outline`
- Padding: `none`, `sm`, `default`, `lg`
- Hoverable option

### Badge Component (`components/ui/badge.tsx`)

- Variants: `default`, `secondary`, `success`, `warning`, `danger`, `outline`, `ghost`
- Sizes: `sm`, `default`, `lg`
- Dot indicator for status
- Left/right icons

### Header Component (`features/navigation/components/header.tsx`)

- Uses subcomponents pattern for organization:
  - `NavLinks` - renders navigation links
  - `HeaderActions` - desktop auth buttons (login/register or profile)
  - `MobileActions` - mobile auth buttons
- Mobile menu with hamburger toggle
- Language toggle button placeholder
- Theme toggle integration
- Responsive: hidden nav on mobile, hamburger on mobile

---

## 5. Feature Pattern

### Structure

```
features/[feature-name]/
├── components/
│   ├── component-a.tsx
│   └── component-b.tsx
├── types/
│   └── types.ts           # TypeScript interfaces
├── utils/
│   └── config.tsx       # Configuration constants
├── messages/           # Feature translations
│   ├── en.json
│   └── es.json
├── constants.ts         # (optional)
├── hooks.ts            # (optional) custom hooks
├── services.ts         # (optional) API services
└── index.ts          # Barrel export all public APIs
```

### Index Export Pattern

```typescript
export { Header } from './components/header';
export { Footer } from './components/footer';
export { NAV_CONFIG } from './utils/config';
export type { NavConfig, NavLink } from './types/types';
```

---

## 6. Deployment & Environments

### Current Setup

- **Platform**: Vercel
- **Build**: `bun run build`
- **Dev Server**: `bun run dev`
- **Lint**: `bun run lint`

### Environment Variables

- `.env` file present (development)

### Not Yet Configured

- Supabase (Auth + Database)
- Prisma (ORM)

---

## 7. Toast Notifications (react-hot-toast)

### apiCallToast Helper

```typescript
import { apiCallToast } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const router = useRouter();

// Usage with fetch or async function
const result = apiCallToast(fetch('/api/endpoint', { method: 'POST' }), {
  loading: 'Guardando...',
  successMessage: '¡Guardado exitosamente!',
  errorMessage: 'Error al guardar',
  redirectTo: '/dashboard',
  router,
});

// For simple toasts, use react-hot-toast directly
import toast from 'react-hot-toast';

toast.success('¡Listo!');
toast.error('Algo salió mal');
toast.loading('Cargando...');
```

### Options

| Option         | Type             | Description                          |
| -------------- | ---------------- | ------------------------------------ |
| `loading`      | string           | Message shown while pending          |
| `successMessage`| string          | Message shown on success             |
| `errorMessage`  | string           | Fallback error message               |
| `redirectTo`   | string (optional)| Navigate here on success            |
| `router`       | AppRouterInstance (optional) | Next.js router for redirect |

---

## 8. API Integration Patterns (Future)

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new APIError(res.status);
  return res.json();
}
```

---

## 8. Testing Approach

Not yet configured. When adding tests:

- **Unit**: Vitest or Jest
- **E2E**: Playwright

---

## 9. Extending Components

### Adding New Variants

```typescript
const buttonVariants = cva([...], {
  variants: {
    variant: {
      newVariant: ['bg-new text-new-foreground'],
    },
  },
});
```

### Creating New UI Components

1. Create `components/ui/new-component.tsx`
2. Use CVA for variants
3. Export from `components/ui/index.ts`
4. Add to design-system for testing

### Creating New Features

1. Create `features/feature-name/` directory
2. Add components, types, utils, messages, index.ts
3. Import into pages via `@/features/feature-name`

---

## 10. Internationalization (next-intl v4)

### Configuration Files

| File               | Purpose                               |
| ------------------ | ------------------------------------- |
| `i18n/routing.ts`  | `defineRouting()` config              |
| `i18n/request.ts`  | `getRequestConfig()` - loads messages |
| `middleware.ts`    | Locale detection + redirect           |
| `messages/en.json` | Root English translations             |
| `messages/es.json` | Root Spanish translations             |

### Routing Config (`i18n/routing.ts`)

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: true,
  localePrefix: 'as-needed',
});
```

### Locale Layout (`app/[locale]/layout.tsx`)

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Feature Translations Pattern

```
features/[feature-name]/
├── components/
├── messages/
│   ├── en.json
│   └── es.json
└── index.ts
```

### Usage in Components

**Server Component**:

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Navigation');
  return <h1>{t('home')}</h1>;
}
```

**Client Component**:

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function ClientComponent() {
  const t = useTranslations('Navigation');
  return <button>{t('login')}</button>;
}
```

### Locale Detection Priority

1. **URL path** (e.g., `/es/about`) - highest
2. **Cookie** (user preference)
3. **Accept-Language header** (browser settings)
4. **Default** (`es`)

### Middleware (`middleware.ts`)

```ts
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Notes

- All routes are under `[locale]` segment: `/en/...`, `/es/...`
- Feature translations live in `features/*/messages/`
- Root `messages/` can be merged at build time (manual for now)

---

## 11. Project Status

### Completed

- ✅ Next.js 16 with App Router + Turbopack
- ✅ Tailwind CSS 4 with custom theme (CSS variables)
- ✅ Feature-based architecture
- ✅ UI Components (Button, Input, Card, Badge, Dialog, Skeleton, Breadcrumb)
- ✅ Dark/Light mode theming (next-themes)
- ✅ Logo with auto dark/light switching
- ✅ next-intl v4 i18n setup
- ✅ Locale routing (`/en/`, `/es/`)
- ✅ Feature translations (navigation, auth, dashboard)
- ✅ Root translations (`messages/`)
- ✅ Middleware for locale detection
- ✅ CVA pattern for all variant components

### In Progress

- [ ] Header translations connected (t(link.label) key mismatch pending)
- [ ] Language toggle component

### Pending

1. Fix nav translation key mismatch (t(link.label) → lowercase keys)
2. Build LanguageToggle component
3. Prisma + Supabase setup
4. Auth implementation
5. Dashboard sidebar

---

## 12. Quick Reference

| Need             | Reference                                     |
| ---------------- | --------------------------------------------- |
| Button styles    | `components/ui/button.tsx` - `buttonVariants` |
| Input with label | `components/ui/input.tsx`                     |
| Card layouts     | `components/ui/card.tsx` - sub-components     |
| Navigation       | `features/navigation/`                        |
| Theme config     | `app/globals.css` - `@theme` section          |
| Dark mode        | `providers/theme-provider.tsx`                |
| Icons            | `lucide-react`                                |
| i18n config      | `i18n/routing.ts`, `i18n/request.ts`          |
| Translations     | `messages/`, `features/*/messages/`           |
| Locale layout    | `app/[locale]/layout.tsx`                     |
| Middleware       | `middleware.ts`                               |
| Toast helpers    | `lib/utils.ts` - `apiCallToast()`             |

---

_This document serves as the definitive guide for this project. All new code should follow the patterns established in this reference._
