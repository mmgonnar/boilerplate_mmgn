# PROJECT_CONTEXT.md

> **Source of Truth** for AI agents and developers working on this repository.
> Last updated: May 27, 2026.

---

## 1. Technical Stack

### Runtime & Framework

| Dependency | Installed Version | Notes                                                                         |
| ---------- | ----------------- | ----------------------------------------------------------------------------- |
| Next.js    | 15.5.16           | App Router with Turbopack (`next.config.ts` has `experimental.turbopack: {}`) |
| React      | 19.2.4            | —                                                                             |
| TypeScript | ^5                | strict mode disabled in tsconfig (`"strict": false`)                          |
| Bun        | latest            | Package manager and runtime                                                   |
| next-intl  | 3.26.5            | **Pinned** — do NOT upgrade to v4 (breaks with Next.js 15)                    |

### Styling

| Dependency               | Version | Notes                                                                            |
| ------------------------ | ------- | -------------------------------------------------------------------------------- |
| Tailwind CSS             | ^4      | CSS-first config via `@theme` block in `app/globals.css` — NO tailwind.config.js |
| @tailwindcss/postcss     | ^4      | PostCSS plugin                                                                   |
| class-variance-authority | 0.7.1   | Component variants (CVA pattern)                                                 |
| clsx + tailwind-merge    | —       | `cn()` utility in `lib/utils.ts`                                                 |

### Forms & Validation

| Dependency          | Version |
| ------------------- | ------- |
| react-hook-form     | 7.73.1  |
| zod                 | 4.3.6   |
| @hookform/resolvers | 5.2.2   |

### Database & ORM

| Dependency         | Version | Notes                                                                    |
| ------------------ | ------- | ------------------------------------------------------------------------ |
| Prisma             | ^7.8    | Schema in `prisma/schema.prisma` (Removed automatically in Landing mode) |
| @prisma/adapter-pg | ^7.8    | PostgreSQL adapter                                                       |
| @prisma/client     | ^7.8    | Generated client                                                         |
| pg                 | ^8.20   | PostgreSQL driver                                                        |

### Auth

| Dependency            | Version | Notes                                                                    |
| --------------------- | ------- | ------------------------------------------------------------------------ |
| @supabase/ssr         | ^0.10   | Server-Side Rendering Auth Utilities                                     |
| @supabase/supabase-js | ^2.105  | Official Supabase Client (Bypassed in Landing mode via early safeguards) |

---

## 2. Project Structure

```
/
├── app/
│   ├── [locale]/                    # i18n route segment
│   │   ├── (auth)/                  # Auth route group (Removed in Landing mode)
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx           # Minimal centered layout
│   │   ├── (dashboard)/             # Authenticated route group (Removed in Landing mode)
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── layout.tsx           # Sidebar + dashboard header layout
│   │   ├── (marketing)/             # Public marketing route group
│   │   │   ├── about/
│   │   │   ├── features/
│   │   │   ├── pricing/
│   │   │   ├── layout.tsx           # Header + Footer layout
│   │   │   └── page.tsx             # Landing page
│   │   ├── design-system/           # Component showcase page
│   │   └── layout.tsx               # Root locale layout (providers, toaster)
│   ├── auth/
│   │   ├── callback/route.ts        # Supabase OAuth/password-reset callback
│   │   ├── layout.tsx
│   │   └── reset-password/
│   ├── globals.css                  # Tailwind v4 + theme CSS variables
│   ├── robots.ts                    # SEO robots.txt
│   └── sitemap.ts                   # SEO sitemap.xml
│
├── components/
│   ├── assets/                      # Static SVG assets
│   ├── design-system/               # Design system demo sections
│   │   ├── badge-design-section.tsx
│   │   ├── index.tsx
│   │   ├── login-form-example.tsx
│   │   ├── profile-form-example.tsx
│   │   └── section-wrapper.tsx
│   ├── ui/                          # Reusable UI primitives
│   │   ├── avatar-upload.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── index.ts                 # Barrel export
│   │   ├── input.tsx
│   │   ├── language-toggle.tsx
│   │   ├── skeleton.tsx
│   │   ├── social-media-icons.tsx
│   │   ├── social-media.tsx
│   │   └── theme-toggle.tsx
│   ├── index.ts                     # Component barrel export
│   └── logo.tsx                     # Auto dark/light logo (inline SVG)
│
├── features/                        # Feature-based modules
│   ├── (items)/                     # Example Supabase CRUD (Removed in Landing mode)
│   │   └── services/
│   │       ├── create-item.ts
│   │       ├── delete-item.ts
│   │       ├── get-items.ts
│   │       ├── index.ts
│   │       └── update-item.ts
│   ├── auth/                        # Authentication feature (Removed in Landing mode)
│   │   ├── components/
│   │   │   ├── forgot-password-form.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── reset-password-form.tsx
│   │   ├── messages/                # Feature-scoped translations
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   ├── schemas/
│   │   │   ├── forgot-password-schema.ts
│   │   │   ├── login-schema.ts
│   │   │   ├── register-schema.ts
│   │   │   └── reset-password-schema.ts
│   │   ├── utils/
│   │   │   └── constants.ts
│   │   └── index.ts                 # Barrel export
│   ├── dashboard/                   # Dashboard feature (Removed in Landing mode)
│   │   ├── components/
│   │   │   ├── dashboard.tsx
│   │   │   └── sidebar.tsx
│   │   ├── messages/
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   └── index.ts
│   ├── navigation/                  # Navigation feature
│   │   ├── components/
│   │   │   ├── footer.tsx
│   │   │   └── header.tsx
│   │   ├── messages/
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   ├── types/
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   └── config.ts            # Holds NAV_CONFIG toggles
│   │   └── index.ts
│   └── profile/                     # Profile feature (Removed in Landing mode)
│       ├── components/
│       │   ├── profile-view.tsx     # Managed Profile UI with reactive database syncing
│       │   └── update-avatar.tsx
│       └── services/
│           ├── index.ts
│           ├── update-avatar-meta.ts
│           └── upload-avatar.ts
│
├── i18n/
│   ├── navigation.ts                # createNavigation() — typed Link, redirect, useRouter, usePathname
│   ├── request.ts                   # getRequestConfig — loads messages (static imports only!)
│   └── routing.ts                   # defineRouting — locales: ['es', 'en'], default: 'es'
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser: createBrowserClient (with Landing Mode Proxy Safeguard)
│   │   ├── middleware.ts            # Middleware: createServerClient handling request/response cookies safely
│   │   └── server.ts                # Server: createServerClient with cookies() (Proxy enabled in Landing)
│   ├── prisma.ts                    # Singleton PrismaClient with @prisma/adapter-pg + Pool (Proxy enabled in Landing)
│   └── utils.ts                     # cn() + apiCallToast()
```

---

## 3. Scripts & Workflow

```bash
bun run dev                # Dev server (predev kills port 3000 first)
bun run build              # Production build
bun run start              # Production server
bun run lint               # Runs ESLint configurations
bunx prisma generate       # Regenerate Prisma client after schema changes
bunx prisma db push        # Push schema changes upstream to Supabase
```

---

## 4. Environment Variables

| Variable                        | Required          | Purpose                                                |
| ------------------------------- | ----------------- | ------------------------------------------------------ |
| `DATABASE_URL`                  | Yes (Dashboard)   | Supabase pooled connection (`:6543`, `pgbouncer=true`) |
| `DIRECT_URL`                    | Yes (Dashboard)   | Supabase direct connection (`:5432`) — migrations      |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes (Dashboard)   | Supabase project URL                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (Dashboard)   | Supabase anonymous key                                 |
| `NEXT_PUBLIC_BASE_URL`          | No                | Production URL (defaults to `http://localhost:3000`)   |

---

## 5. Architecture

### Route Groups

| Group         | Path prefix                               | Layout                     | Purpose              |
| ------------- | ----------------------------------------- | -------------------------- | -------------------- |
| `(marketing)` | `/`, `/about`, `/features`, `/pricing`    | Header + Footer            | Public pages         |
| `(auth)`      | `/login`, `/register`, `/forgot-password` | Minimal centered           | Authentication pages |
| `(dashboard)` | `/dashboard`, `/profile`                  | Sidebar + dashboard header | Authenticated app    |

### Polymorphic CLI Support (Landing vs Full Mode)

The repository acts as a fluid, modular system. When configured as a Landing Page (by omitting database/supabase env vars), core library utilities (`prisma.ts`, `supabase/client.ts`) initialize lightweight **Proxy objects** that safely absorb calls and isolate environment configurations seamlessly.

### Feature-First Pattern

All feature code lives under `features/[name]/` with co-located files. Features are imported via `@/features/[name]`.

```
features/[name]/
├── components/      # React components
├── messages/        # en.json, es.json (i18n)
├── schemas/         # zod schemas (optional)
├── services/        # API/DB calls (optional)
├── types/           # TypeScript types (optional)
├── utils/           # helpers/constants (optional)
└── index.ts         # Barrel export (named exports only)
```

---

## 6. Coding Standards

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`).
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`).
- **Services/Utils**: camelCase (e.g., `apiCallToast.ts`).
- **Folders**: kebab-case (e.g., `design-system`).

### Component Declaration

- **Named Exports**: Strictly use named exports. NO default exports except for Next.js pages/layouts.
- **ForwardRef**: Always use `React.forwardRef` for UI primitives to allow parent ref access.
- **CVA Pattern**: Use `class-variance-authority` for variant-heavy components.
- **Co-location**: Define private sub-components in the same file as the main component to keep features focused.

### Styling (Tailwind v4)

- **Semantic Tokens**: Use `bg-background`, `text-foreground`, `border-border`, etc.
- **No `dark:` Variants**: Tailwind v4 `dark:` variants are avoided. Use `isDark` from `useTheme()` combined with `cn()` for conditional dark styles.
- **CSS-First**: Configuration lives in `@theme` block in `app/globals.css`.

---

## 7. Internationalization (next-intl 3.26.5)

### Config

- **Pinned version**: 3.26.5 (v4 breaks with Next.js 15).
- **Static Imports**: Only static imports in `i18n/request.ts`.
- **Navigation**: Use hooks and components from `@/i18n/navigation`.

### Import Rules

| Context          | Import                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Server Component | `getTranslations` from `'next-intl/server'`                             |
| Client Component | `useTranslations` from `'next-intl'`                                    |
| Navigation       | `Link`, `useRouter`, `redirect`, `usePathname` from `@/i18n/navigation` |

---

## 8. Database (Prisma 7 + Supabase PostgreSQL)

- **Schema**: `prisma/schema.prisma` (datasource configured in `prisma.config.ts`).
- **Client**: Singleton in `lib/prisma.ts` using `@prisma/adapter-pg`.
- **Workflow**: `bunx prisma generate` → `bunx prisma db push`.

---

## 9. Authentication (Supabase Auth)

- **Provider**: `AuthProvider` in `providers/auth-provider.tsx`.
- **Middleware**: Handles route protection and localized redirects in `middleware.ts`.
- **Clients**: `lib/supabase/client.ts` (browser), `server.ts` (RSC), `middleware.ts` (Middleware).

---

## 10. UI Components

| Component      | File                             | Key Features                                                                   |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------ |
| Button         | `components/ui/button.tsx`       | Polymorphic (button/Link), loading state, icons, variants.                     |
| Input          | `components/ui/input.tsx`        | Label, error/hint feedback, icons, ARIA support.                               |
| Card           | `components/ui/card.tsx`         | Sub-components (Header, Title, etc.), variants, hoverable.                     |
| LanguageToggle | `components/ui/language-toggle.tsx` | Desktop dropdown + Mobile full-width switcher.                                 |
| ThemeToggle    | `components/ui/theme-toggle.tsx` | Dark/light/system switcher.                                                    |
| Form           | `components/ui/form.tsx`         | Type-safe wrappers for `react-hook-form`.                                      |

---

## 11. Deployment & Environments

### Vercel (Frontend)

- **Build Command**: `next build`
- **Install Command**: `bun install`
- **Env Vars**: Must match those in `.env.example`.

### Supabase (Backend)

- **Database**: PostgreSQL with Prisma.
- **Auth**: Configured for Email/Password and OAuth.
- **Storage**: `avatars` bucket required for profile pictures (see `supabase_setup.sql`).

---

## 12. Known Gotchas

| Issue                               | Cause                            | Workaround                         |
| ----------------------------------- | -------------------------------- | ---------------------------------- |
| `dark:` variants don't work         | Tailwind v4 CSS-first            | Use `isDark` + `cn()`              |
| next-intl v4 crashes                | Next.js 15 incompatible          | Pinned to 3.26.5                   |
| Dynamic locale imports fail         | Next.js 15 bundler               | Static imports in `request.ts`     |
| `middleware.ts` deprecation warning | Next.js 15 prefers `proxy.ts`    | Blocked by next-intl, non-blocking |

---

## 13. Current Status

### Completed

- ✅ Next.js 15 App Router + Turbopack
- ✅ Tailwind CSS 4 with custom theme
- ✅ UI Components (Button, Input, Card, Badge, Dialog, Skeleton, ThemeToggle, LanguageToggle, Form, Avatar)
- ✅ next-intl 3.26.5 i18n setup
- ✅ Prisma 7 + Supabase Auth
- ✅ Middleware route protection
- ✅ SEO (robots.ts, sitemap.ts, generateMetadata)

### Pending

- [ ] Dashboard sidebar (nav implementation)
- [ ] Radix UI primitives (Tooltip, Dropdown, Select, Tabs)
- [ ] Table with sorting
- [ ] Error pages (404, 500)
- [ ] Test framework (Vitest/Jest + Playwright)

---

_This document is the authoritative reference for this project. All new code should follow the patterns established here._
