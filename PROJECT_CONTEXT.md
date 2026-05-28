# PROJECT_CONTEXT.md

> **Source of Truth** for AI agents and developers working on this repository.
> Last updated: May 2026.

---

## 1. Technical Stack

### Runtime & Framework

| Dependency | Installed Version | Notes |
|---|---|---|
| Next.js | 15.5.16 | App Router with Turbopack (`next.config.ts` has `experimental.turbopack: {}`) |
| React | 19.2.4 | — |
| TypeScript | ^5 | strict mode disabled in tsconfig (`"strict": false`) |
| Bun | latest | Package manager and runtime |
| next-intl | 3.26.5 | **Pinned** — do NOT upgrade to v4 (breaks with Next.js 15) |

### Styling

| Dependency | Version | Notes |
|---|---|---|
| Tailwind CSS | ^4 | CSS-first config via `@theme` block in `app/globals.css` — NO tailwind.config.js |
| @tailwindcss/postcss | ^4 | PostCSS plugin |
| postcss | — | Via `postcss.config.mjs` |
| class-variance-authority | 0.7.1 | Component variants (CVA pattern) |
| clsx + tailwind-merge | — | `cn()` utility in `lib/utils.ts` |

### Forms & Validation

| Dependency | Version |
|---|---|
| react-hook-form | 7.73.1 |
| zod | 4.3.6 |
| @hookform/resolvers | 5.2.2 |

### Database & ORM

| Dependency | Version | Notes |
|---|---|---|
| Prisma | ^7.8 | Schema in `prisma/schema.prisma` |
| @prisma/adapter-pg | ^7.8 | PostgreSQL adapter |
| @prisma/client | ^7.8 | Generated client |
| pg | ^8.20 | PostgreSQL driver |

### Auth

| Dependency | Version |
|---|---|
| @supabase/ssr | ^0.10 |
| @supabase/supabase-js | ^2.105 |

### Utilities

| Dependency | Version | Notes |
|---|---|---|
| next-themes | ^0.4 | Dark/light mode |
| lucide-react | ^1.8 | Icons |
| react-hot-toast | ^2.6 | Toast notifications |

### Dev Tools

| Tool | Version | Notes |
|---|---|---|
| ESLint | ^9 | Flat config (`eslint.config.mjs`) — Next.js core-web-vitals + TS |
| Prettier | — | With `@trivago/prettier-plugin-sort-imports` |
| @trivago/prettier-plugin-sort-imports | ^6.0 | Import ordering |
| prettier-plugin-tailwindcss | ^0.7 | Tailwind class sorting |

---

## 2. Project Structure

```
/
├── app/
│   ├── [locale]/                    # i18n route segment
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx           # Minimal centered layout
│   │   ├── (dashboard)/             # Authenticated route group
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
│   ├── (items)/                     # Example Supabase CRUD
│   │   └── services/
│   │       ├── create-item.ts
│   │       ├── delete-item.ts
│   │       ├── get-items.ts
│   │       ├── index.ts
│   │       └── update-item.ts
│   ├── auth/                        # Authentication feature
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
│   ├── dashboard/                   # Dashboard feature
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
│   │   │   └── config.ts
│   │   └── index.ts
│   └── profile/                     # Profile feature
│       ├── components/
│       │   ├── profile-view.tsx
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
│   │   ├── client.ts                # Browser: createBrowserClient
│   │   ├── middleware.ts            # Middleware: createServerClient with request/response cookies
│   │   └── server.ts                # Server: createServerClient with cookies()
│   ├── prisma.ts                    # Singleton PrismaClient with @prisma/adapter-pg + Pool
│   └── utils.ts                     # cn() + apiCallToast()
│
├── messages/                        # Root i18n translations
│   ├── en.json
│   └── es.json
│
├── providers/
│   ├── index.ts                     # Barrel export
│   ├── auth-provider.tsx            # Auth context (user, session, signOut, refreshUser, mfaVerified)
│   └── theme-provider.tsx           # next-themes wrapper
│
├── prisma/
│   └── schema.prisma                # Models: User, Session
│
├── prisma.config.ts                 # Prisma 7 datasource config (reads DIRECT_URL)
├── middleware.ts                    # Combined i18n + Supabase auth middleware
├── next.config.ts                   # Next.js config + next-intl plugin
├── postcss.config.mjs               # Tailwind PostCSS
├── eslint.config.mjs                # ESLint flat config
├── .prettierrc                      # Prettier config with import ordering
└── supabase_setup.sql               # Example Supabase table with RLS policies
```

---

## 3. Scripts

```bash
bun run dev                # Dev server (predev kills port 3000 first)
bun run build              # Production build
bun run start              # Production server
bun run lint               # ESLint only
bunx prisma generate       # Regenerate Prisma client after schema changes
bunx prisma db push        # Push schema to database
```

- No test framework configured
- No `tsc` typecheck script — relies on IDE

---

## 4. Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Supabase pooled connection (`:6543`, `pgbouncer=true`) |
| `DIRECT_URL` | Yes | Supabase direct connection (`:5432`) — migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `NEXT_PUBLIC_BASE_URL` | No | Production URL (defaults to `http://localhost:3000`) |

---

## 5. Architecture

### Route Groups

| Group | Path prefix | Layout | Purpose |
|---|---|---|---|
| `(marketing)` | `/`, `/about`, `/features`, `/pricing` | Header + Footer | Public pages |
| `(auth)` | `/login`, `/register`, `/forgot-password` | Minimal centered | Authentication pages |
| `(dashboard)` | `/dashboard`, `/profile` | Sidebar + dashboard header | Authenticated app |

### Feature-First Pattern

All feature code lives under `features/[name]/` with co-located files:

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

Features are imported via `@/features/[name]`.

### Component Patterns

1. **CVA Pattern** — all variant components use `cva()` + `VariantProps` + named export of both component and variants
2. **Polymorphic Button** — renders `<button>` or `<Link>` based on presence of `href` prop
3. **Subcomponent Pattern** — private helper components defined in same file (e.g., `NavLinks`, `HeaderActions` inside `header.tsx`)
4. **Barrel Exports** — `components/ui/index.ts` and every `features/[name]/index.ts` re-exports all public members
5. **No default exports** — named exports only (except Next.js page/layout files)

### Import Order (Prettier)

```
^react → ^next → <THIRD_PARTY_MODULES> → ^@/features/ → ^@/components/ → ^@/lib/ → ^[./]
```

---

## 6. Internationalization (next-intl 3.26.5)

### Config

```ts
// i18n/routing.ts
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: true,
  localePrefix: 'as-needed',
});
```

### Locale Detection Priority

1. URL path (`/en/about`)
2. Cookie
3. Accept-Language header
4. Default (`es`)

### Translation Files

| Location | Scope |
|---|---|
| `messages/{locale}.json` | Root/common translations |
| `features/auth/messages/{locale}.json` | Auth feature |
| `features/navigation/messages/{locale}.json` | Navigation |
| `features/dashboard/messages/{locale}.json` | Dashboard |

### Import Rules

| Context | Import |
|---|---|
| Server Component | `getTranslations` from `'next-intl/server'` |
| Client Component | `useTranslations` from `'next-intl'` |
| Navigation | `Link`, `useRouter`, `redirect`, `usePathname` from `@/i18n/navigation` |

### Important Gotchas

- **next-intl pinned to 3.26.5** — v4 crashes with Next.js 15
- **Static imports only** in `i18n/request.ts` — dynamic imports broken in Next.js 15
- `middleware.ts` shows deprecation warning (Next.js 15 prefers `proxy.ts`) — non-blocking, blocked by next-intl

---

## 7. Database (Prisma 7 + Supabase PostgreSQL)

### Configuration

- **Schema**: `prisma/schema.prisma` — no `url`/`directUrl` (moved to `prisma.config.ts`)
- **Config**: `prisma.config.ts` — reads `DIRECT_URL` from env
- **Client**: `lib/prisma.ts` — singleton using `@prisma/adapter-pg` with `Pool`
- **Connection**: Supabase connection pooling (`DATABASE_URL` for app, `DIRECT_URL` for migrations)

### Models

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  avatarUrl     String?
  mfaEnabled    Boolean   @default(false)
  mfaSecret     String?
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Workflow

```bash
bunx prisma generate   # After schema changes
bunx prisma db push    # Push to Supabase
```

---

## 8. Authentication (Supabase Auth)

### Architecture

- **Supabase Auth** manages credentials (email/password, OAuth)
- **Three client contexts**:
  - `lib/supabase/client.ts` — browser (`createBrowserClient`)
  - `lib/supabase/server.ts` — server components (`createServerClient` + `cookies()`)
  - `lib/supabase/middleware.ts` — middleware (`createServerClient` with request/response cookie handling)
- **Auth Provider** (`providers/auth-provider.tsx`) — React context providing `user`, `session`, `signOut`, `refreshUser`, `isLoading`, `mfaVerified`

### Middleware Flow (`middleware.ts`)

```
Request → intlMiddleware (locale detection)
       → supabase.getUser()
       → protected route (/dashboard, /profile, /settings) + no user? → redirect /login
       → auth route (/login, /register) + has user? → redirect /dashboard
       → else → pass through
```

### Auth Forms

All use react-hook-form + zod + apiCallToast:
- `LoginForm` — email + password → redirect to `/dashboard`
- `RegisterForm` — email + password + confirmation
- `ForgotPasswordForm` — email → sends reset via Supabase
- `ResetPasswordForm` — new password + confirmation

### Example CRUD (Supabase)

`features/(items)/services/` demonstrates Supabase CRUD against `public.items` table with RLS. Run `supabase_setup.sql` to create the table.

### Auth Callback

`app/auth/callback/route.ts` handles OAuth and password reset code exchange via `supabase.auth.exchangeCodeForSession(code)`.

---

## 9. Theming & Dark Mode

### CSS Variables (`app/globals.css`)

Colors defined as HSL variables in `@theme` block:

```css
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  /* ... */
}
```

Light values in `:root {}`, dark values in `.dark {}`.

### Dark Mode Rules

- **NEVER use `dark:` Tailwind variants** — unreliable in Tailwind v4
- Always use semantic tokens: `bg-background`, `text-foreground`, `border-border`
- Conditional dark styles via `isDark` from `useTheme()` + `cn()`:

```tsx
className={cn("bg-white", isDark && "bg-neutral-900")}
```

---

## 10. UI Components

| Component | File | Key Features |
|---|---|---|
| Button | `components/ui/button.tsx` | Polymorphic (button/Link), loading spinner, left/right icons, 5 variants, 4 sizes |
| Input | `components/ui/input.tsx` | Label, error/hint, left/right icons, ARIA |
| Card | `components/ui/card.tsx` | Sub-components (Header, Title, Description, Content, Footer, Separator), 4 variants, 4 padding sizes, hoverable |
| Badge | `components/ui/badge.tsx` | 7 variants, 3 sizes, dot indicator, left/right icons |
| Form | `components/ui/form.tsx` | react-hook-form Form/FormField wrappers |
| Dialog | `components/ui/dialog.tsx` | Modal dialog |
| Skeleton | `components/ui/skeleton.tsx` | Loading placeholder |
| Breadcrumb | `components/ui/breadcrumb.tsx` | Navigation breadcrumb |
| ThemeToggle | `components/ui/theme-toggle.tsx` | Dark/light toggle |
| LanguageToggle | `components/ui/language-toggle.tsx` | Locale switcher |
| Avatar | `components/ui/avatar.tsx` | User avatar |
| AvatarUpload | `components/ui/avatar-upload.tsx` | Avatar upload with preview |

---

## 11. Known Gotchas

| Issue | Cause | Workaround |
|---|---|---|
| `dark:` variants don't work | Tailwind v4 CSS-first | Use `isDark` + `cn()` |
| next-intl v4 crashes | Next.js 15 incompatible | Pinned to 3.26.5 |
| Dynamic locale imports fail | Next.js 15 bundler | Static imports in `request.ts` |
| `middleware.ts` deprecation warning | Next.js 15 prefers `proxy.ts` | Blocked by next-intl, non-blocking |
| next-intl navigation hooks | Requires `createNavigation()` | Import from `@/i18n/navigation` |
| Prisma schema `url` error | Prisma 7 removed url from schema | Use `prisma.config.ts` |
| PrismaClient import error | IDE cache | Restart TS Server (Cmd+Shift+P) |

---

## 12. Current Status

### Completed

- ✅ Next.js 15 App Router + Turbopack
- ✅ Tailwind CSS 4 with custom theme (CSS variables)
- ✅ Feature-based architecture
- ✅ UI Components (Button, Input, Card, Badge, Dialog, Skeleton, Breadcrumb, Form, Avatar, AvatarUpload, ThemeToggle, LanguageToggle)
- ✅ Dark/Light mode theming (next-themes, CSS custom properties)
- ✅ Logo with auto dark/light switching
- ✅ next-intl 3.26.5 i18n setup
- ✅ Locale routing (`/es/`, `/en/`)
- ✅ Feature-scoped translations (navigation, auth, dashboard)
- ✅ CVA pattern for all variant components
- ✅ Prisma 7 + Supabase PostgreSQL connection
- ✅ Supabase Auth (login, register, session management)
- ✅ Middleware route protection (i18n + auth)
- ✅ Auth callback route
- ✅ SEO (robots.ts, sitemap.ts, generateMetadata)

### Pending

- [ ] Dashboard sidebar (stub exists, needs implementation)
- [ ] Avatar component (AvatarUpload exists, Avatar stubs exist)
- [ ] Radix UI primitives (Tooltip, Dropdown, Select, Tabs)
- [ ] Table with sorting
- [ ] Error pages (404, 500)
- [ ] User profile page (profile route exists, minimal)
- [ ] Test framework (Vitest/Jest + Playwright)

---

_This document is the authoritative reference for this project. All new code should follow the patterns established here._
