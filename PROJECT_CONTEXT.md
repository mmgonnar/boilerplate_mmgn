# PROJECT_CONTEXT.md

> **Source of Truth** for AI agents and developers working on this repository.
> Generated from architectural audit. Last updated: May 2026.

---

## 1. Technical Stack

### Core Framework
- **Next.js**: 16.2.2 (App Router)
- **React**: 19.2.4
- **TypeScript**: 5.x (strict mode enabled)
- **Runtime**: Bun

### Styling
- **Tailwind CSS**: 4.x (with `@theme` custom properties)
- **PostCSS**: Configured via `postcss.config.mjs`
- **class-variance-authority**: 0.7.1 (for component variants)
- **clsx** + **tailwind-merge**: For className composition

### Forms & Validation
- **react-hook-form**: 7.73.1
- **zod**: 4.3.6 (schema validation)
- **@hookform/resolvers**: 5.2.2

### Theming & UI
- **next-themes**: 0.4.6 (dark mode)
- **lucide-react**: 1.8.0 (icons)

### Development
- **ESLint**: 9.x
- **Prettier**: With tailwindcss and import-sort plugins

---

## 2. Architecture Overview

### Directory Structure

```
/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/             # Authenticated route group
│   │   └── dashboard/
│   ├── (marketing)/            # Public marketing pages
│   │   ├── about/
│   │   ├── features/
│   │   ├── pricing/
│   │   └── page.tsx            # Landing
│   ├── design-system/           # Component showcase
│   ├── globals.css             # Tailwind v4 theme config
│   └── layout.tsx              # Root layout with providers
│
├── components/
│   ├── assets/                 # Static assets (SVG, etc.)
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
│   └── logo.tsx                # Logo component
│
├── features/                   # Feature-based modules
│   └── navigation/
│       ├── components/
│       │   ├── header.tsx
│       │   └── footer.tsx
│       ├── types/
│       │   └── types.ts
│       ├── utils/
│       │   └── config.tsx
│       └── index.ts            # Barrel export
│
├── lib/
│   └── utils.ts               # Shared utilities (cn function)
│
├── providers/
│   ├── index.ts
│   └── theme-provider.tsx    # next-themes wrapper
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── prettierrc
```

### Route Groups

| Group | Purpose | Layout |
|-------|---------|--------|
| `(auth)` | Authentication pages | Minimal, centered content |
| `(dashboard)` | Authenticated app | With sidebar/layout |
| `(marketing)` | Public marketing | With Header/Footer |

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

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Button`, `CardHeader` |
| Files | kebab-case | `button.tsx`, `card-header.tsx` |
| Features | kebab-case | `navigation`, `user-profile` |
| Types | PascalCase | `ButtonProps`, `NavLink` |
| Variants | camelCase | `buttonVariants`, `cardVariants` |
| Props | camelCase | `className`, `leftIcon` |

### Import Path Aliases

```typescript
// @/ resolves to project root
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Header } from '@/features/navigation';
```

### Tailwind CSS Pattern

```css
/* globals.css - Tailwind v4 */
@import "tailwindcss";

@theme {
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  /* ... */
}

@layer base {
  :root {
    --primary: 142 71% 35%;
    --primary-foreground: 0 0% 100%;
  }
  .dark { /* ... */ }
}
```

### Dark Mode Integration

All components must support both light/dark themes via CSS variables. Use semantic colors:

```typescript
// Correct
className="bg-background text-foreground"

// Avoid
className="bg-white dark:bg-gray-900"
```

---

## 4. Component Patterns

### Button Component (`components/ui/button.tsx`)

**Features:**
- Dual mode: renders as `<button>` or `<Link>` based on `href` prop
- Loading state with spinner
- Left/right icons
- Sizes: `default`, `sm`, `lg`, `icon`
- Variants: `primary`, `outline`, `ghost`, `danger`, `secondary`

### Input Component (`components/ui/input.tsx`)

**Features:**
- Label + input + error/hint messages
- Left/right icons
- Full ARIA accessibility
- Error state styling

### Card Component (`components/ui/card.tsx`)

**Features:**
- Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardSeparator`
- Variants: `default`, `elevated`, `ghost`, `outline`
- Padding: `none`, `sm`, `default`, `lg`
- Hoverable option

### Badge Component (`components/ui/badge.tsx`)

**Features:**
- Variants: `default`, `secondary`, `success`, `warning`, `danger`, `outline`, `ghost`
- Sizes: `sm`, `default`, `lg`
- Dot indicator for status
- Left/right icons

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
├── constants.ts         # (optional)
├── hooks.ts            # (optional) custom hooks
├── services.ts        # (optional) API services
└── index.ts          # Barrel export all public APIs
```

### Index Export Pattern

```typescript
// features/navigation/index.ts
export { Header } from './components/header';
export { Footer } from './components/footer';
export { NAV_CONFIG } from './utils/config';
export type { NavConfig, NavLink } from './types/types';
```

---

## 6. Deployment & Environments

### Current Setup
- **Platform**: Vercel (ready for deployment)
- **Build**: `npm run build` or `bun run build`
- **Dev Server**: `npm run dev` or `bun run dev`
- **Lint**: `npm run lint` or `bun run lint`

### Environment Variables
- `.env` file present (development)

### Not Yet Configured
- Supabase (prepared for Auth integration)
- Database (prepared for persistence)

---

## 7. API Integration Patterns (Future)

When integrating APIs:

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) throw new APIError(res.status);
  return res.json();
}

// Usage in server components or server actions
async function getProjects() {
  'use server';
  return fetchAPI<Project[]>('/projects');
}
```

---

## 8. Testing Approach

Not yet configured. When adding tests:

- **Unit**: Vitest or Jest
- **E2E**: Playwright
- **Location**: `__tests__/` or `tests/` directories

---

## 9. Extending Components

### Adding New Variants

```typescript
// To add a new variant to an existing component:
const buttonVariants = cva([...], {
  variants: {
    variant: {
      // ...existing variants
      newVariant: ['bg-new text-new-foreground hover:bg-new/90'],
    },
  },
});
```

### Creating New UI Components

Follow the existing pattern:
1. Create `components/ui/new-component.tsx`
2. Use CVA for variants
3. Export from `components/ui/index.ts`
4. Add to design-system for testing

### Creating New Features

1. Create `features/feature-name/` directory
2. Add components, types, utils, index.ts
3. Import into pages via `@/features/feature-name`

---

## 10. Quick Reference

| Need | Reference |
|------|-----------|
| Button styles | `components/ui/button.tsx` - `buttonVariants` |
| Input with label | `components/ui/input.tsx` |
| Card layouts | `components/ui/card.tsx` - sub-components |
| Navigation | `features/navigation/` |
| Theme config | `app/globals.css` - `@theme` section |
| Dark mode | `providers/theme-provider.tsx` |
| Icons | `lucide-react` - import from package |

---

*This document serves as the definitive guide for this project. All new code should follow the patterns established in this reference.*