# Boilerplate — Next.js + Supabase + Prisma 7

> Production-ready boilerplate with internationalization, authentication, and a feature-based architecture.

## Tech Stack

| Layer               | Tech                            | Version                        |
| ------------------- | ------------------------------- | ------------------------------ |
| **Framework**       | Next.js (App Router)            | ^15 (turbopack)                |
| **Runtime**         | React                           | 19.2.4                         |
| **Language**        | TypeScript                      | ^5 (strict)                    |
| **Styling**         | Tailwind CSS                    | ^4 (CSS-first, `@theme` block) |
| **ORM**             | Prisma                          | ^7.8 with `@prisma/adapter-pg` |
| **Database**        | PostgreSQL (Supabase)           | —                              |
| **Auth**            | Supabase Auth + `@supabase/ssr` | ^0.10                          |
| **i18n**            | next-intl                       | 3.26.5 (pinned)                |
| **Forms**           | react-hook-form + zod           | ^7.73 + ^4                     |
| **Theming**         | next-themes                     | ^0.4                           |
| **Components**      | class-variance-authority (CVA)  | ^0.7                           |
| **Notifications**   | react-hot-toast                 | ^2.6                           |
| **Icons**           | lucide-react                    | ^1.8                           |
| **Package Manager** | Bun                             | latest                         |
| **Linting**         | ESLint                          | ^9                             |
| **Formatting**      | Prettier + import sorting       | —                              |

## Prerequisites

- [Bun](https://bun.sh) >= 1.2

## CLI — `bunx mmgn`

Scaffold a new project from the boilerplate with a single command:

```bash
bunx mmgn@latest app
```

You'll be prompted for:

- **Project name**
- **Variant** — choose between:

| Variant                | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| **Dashboard Completo** | Full boilerplate: Auth + i18n + Dashboard + CRUD + Prisma           |
| **Solo Landing Page**  | Landing-only: public pages only, no Auth, no Dashboard, no database |

### Dashboard Completo

After scaffolding, complete the setup:

```bash
cd your-project
cp .env.example .env
# Edit .env with your Supabase credentials (see Environment Variables below)
bun install
bunx prisma generate
bunx prisma db push
# (Optional) Run supabase_setup.sql via Supabase SQL Editor for example tables
bun run dev
```

### Solo Landing Page

```bash
cd your-project
bun install
bun run dev
```

> No `.env` editing, no database setup needed.

### Available Commands

| Command                | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `bunx mmgn@latest app` | Scaffold a new project (sanitized)                          |
| `bunx mmgn env`        | Copy `.env` from boilerplate to current project (local use) |
| `bunx mmgn --version`  | Show version                                                |
| `bunx mmgn --help`     | Show help                                                   |
| `bun run clone <name>` | Full clone with all files (`.github/`, docs, etc.)          |

## Environment Variables

| Variable                        | Required | Description                                                |
| ------------------------------- | -------- | ---------------------------------------------------------- |
| `DATABASE_URL`                  | Yes      | Supabase pooled connection (`:6543`, `pgbouncer=true`)     |
| `DIRECT_URL`                    | Yes      | Supabase direct connection (`:5432`) — used for migrations |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Supabase project URL                                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Supabase anonymous key                                     |
| `NEXT_PUBLIC_BASE_URL`          | No       | Production URL (defaults to `http://localhost:3000`)       |

> **Security**: The `.env` file is gitignored by default. Never commit secrets.

## Project Structure

```
├── app/
│   ├── [locale]/                    # i18n route segment
│   │   ├── (auth)/                  #   Auth pages (login, register)
│   │   ├── (dashboard)/             #   Authenticated pages
│   │   ├── (marketing)/             #   Public pages (landing, about, pricing)
│   │   ├── design-system/           #   Component showcase
│   │   └── layout.tsx               #   Root locale layout (providers, toaster)
│   ├── auth/callback/               # Supabase OAuth callback route
│   ├── globals.css                  # Tailwind v4 + theme CSS variables
│   ├── robots.ts                    # SEO robots
│   └── sitemap.ts                   # SEO sitemap
│
├── components/
│   ├── ui/                          # Reusable UI primitives (button, input, card, etc.)
│   ├── design-system/               # Design system demo sections
│   ├── assets/                      # Static SVGs
│   ├── index.ts                     # Barrel export
│   └── logo.tsx                     # Auto dark/light logo
│
├── features/                        # Feature-based modules
│   ├── auth/                        #   Auth forms, schemas, translations
│   ├── dashboard/                   #   Dashboard components, sidebar
│   ├── navigation/                  #   Header, footer, nav config
│   ├── profile/                     #   Profile view, avatar upload
│   └── (items)/                     #   Example CRUD services (Supabase)
│
├── i18n/
│   ├── routing.ts                   # next-intl routing config
│   ├── request.ts                   # Message loader (static imports)
│   └── navigation.ts                # Typed navigation helpers (Link, redirect, etc.)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client
│   │   ├── server.ts                # Server Supabase client
│   │   └── middleware.ts            # Middleware Supabase client
│   ├── prisma.ts                    # Singleton Prisma client (adapter-pg)
│   └── utils.ts                     # cn(), apiCallToast()
│
├── providers/
│   ├── auth-provider.tsx            # Auth context provider
│   ├── theme-provider.tsx           # next-themes wrapper
│   └── index.ts                     # Barrel export
│
├── messages/                        # Root i18n translations
│   ├── en.json
│   └── es.json
│
├── prisma/
│   ├── schema.prisma                # Database schema (no url — uses prisma.config.ts)
│   └── migrations/                  # Generated migrations
│
├── prisma.config.ts                 # Prisma 7 datasource config
├── middleware.ts                    # i18n + auth middleware
├── next.config.ts                   # Next.js config + next-intl plugin
├── postcss.config.mjs               # Tailwind PostCSS config
├── eslint.config.mjs                # ESLint flat config
├── .prettierrc                      # Prettier + import ordering
└── supabase_setup.sql               # Example Supabase RLS table setup
```

## Architecture

### Route Groups

| Group         | Purpose           | Layout                     |
| ------------- | ----------------- | -------------------------- |
| `(marketing)` | Public pages      | Header + Footer            |
| `(auth)`      | Login/Register    | Minimal centered           |
| `(dashboard)` | Authenticated app | Sidebar + Dashboard header |

### Feature-First Pattern

Each feature lives in `features/[name]/` and is self-contained:

```
features/auth/
├── components/          # login-form, register-form, etc.
├── schemas/             # zod validation schemas
├── utils/               # constants, helpers
├── messages/            # en.json, es.json
└── index.ts             # Barrel export (named exports only)
```

Features are imported via `@/features/auth`.

### Component Patterns

**CVA (class-variance-authority)** — all variant components use `cva()`:

```tsx
const buttonVariants = cva([...baseStyles], {
  variants: {
    variant: { primary: [...], outline: [...] },
    size: { default: 'h-10 px-4', sm: 'h-9 px-3' },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
});
```

**Polymorphic Button** — renders `<button>` or `<Link>` based on `href` prop.

**Subcomponent Pattern** — private subcomponents defined in the same file (e.g., `NavLinks`, `HeaderActions` inside `header.tsx`).

**Barrel Exports** — every `features/[name]/index.ts` and `components/ui/index.ts` re-exports all public members.

## Database

### Prisma 7 with Supabase PostgreSQL

- **Schema**: `prisma/schema.prisma` — no `url`/`directUrl` (moved to `prisma.config.ts`)
- **Config**: `prisma.config.ts` — reads `DIRECT_URL` from env
- **Client**: `lib/prisma.ts` — singleton using `@prisma/adapter-pg` with `Pool`

```bash
# After schema changes
bunx prisma generate
bunx prisma db push
```

### Current Models

- `User` — id, email, name, avatarUrl, mfa fields, emailVerified
- `Session` — id, userId, token, expiresAt

### Example Feature: CRUD Items

The `features/(items)/services/` directory provides an example of Supabase-based CRUD operations against a `public.items` table. Run `supabase_setup.sql` in your Supabase SQL Editor to create the table with Row Level Security.

## Authentication

### How It Works

1. **Supabase Auth** handles credentials (email/password or OAuth)
2. **Middleware** (`middleware.ts`) checks auth on protected routes (`/dashboard`, `/profile`, `/settings`) and redirects unauthenticated users
3. **Auth Provider** (`providers/auth-provider.tsx`) provides `user`, `session`, `signOut`, `refreshUser` via React context
4. **Supabase Clients** are instantiated per-environment:
   - `lib/supabase/client.ts` — browser (`createBrowserClient`)
   - `lib/supabase/server.ts` — server components (`createServerClient` + `cookies()`)
   - `lib/supabase/middleware.ts` — middleware (`createServerClient` with request/response cookies)

### Auth Flow

```
/login → LoginForm → supabase.auth.signInWithPassword()
                    → apiCallToast → redirect to /dashboard
                    → AuthProvider updates context

Middleware: request → intlMiddleware → supabase.getUser()
                    → protected? no user? → redirect /login
                    → auth route? has user? → redirect /dashboard
```

### OAuth Providers

Google and GitHub sign-in buttons are handled by a shared `OAuthProviders` component:

- **Responsive layout**: icon only (desktop), icon + text (mobile)
- **Contextual text**: button copy adapts per mode (`Sign in with Google` vs `Sign up with Google`)
- **Toast feedback**: loading/success/error messages via `apiCallToast`
- **Shared logic**: single component used in both `LoginForm` and `RegisterForm`

### Forms

All auth forms use react-hook-form + zod for validation:

- `LoginForm` — email + password + OAuth
- `RegisterForm` — email + password + confirmation + OAuth
- `ForgotPasswordForm` — email
- `ResetPasswordForm` — new password + confirmation

## Internationalization

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
2. Cookie (user preference)
3. Accept-Language header
4. Default (`es`)

### Translation Files

| Location                                     | Scope                           |
| -------------------------------------------- | ------------------------------- |
| `messages/{locale}.json`                     | Root translations (common, SEO) |
| `features/auth/messages/{locale}.json`       | Auth feature                    |
| `features/navigation/messages/{locale}.json` | Navigation                      |
| `features/dashboard/messages/{locale}.json`  | Dashboard                       |

### Import Rules

| Context          | Import from                                  |
| ---------------- | -------------------------------------------- |
| Server Component | `getTranslations` from `'next-intl/server'`  |
| Client Component | `useTranslations` from `'next-intl'`         |
| Navigation       | `Link`, `useRouter` from `@/i18n/navigation` |

> **Important**: next-intl is pinned to 3.26.5 — do not upgrade. v4 crashes with Next.js 16.

## Theming & Dark Mode

### CSS Variables

Colors are defined as HSL variables in `app/globals.css`:

```css
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  /* ... */
}

:root {
  /* light */
}
.dark {
  /* dark */
}
```

### Dark Mode Rules

- **Never use `dark:` Tailwind variants** — they are unreliable in Tailwind v4
- Always use `isDark` from `useTheme()` + `cn()` for conditional styles:
  ```tsx
  className={cn("bg-white", isDark && "bg-neutral-900")}
  ```
- Use semantic tokens only: `bg-background`, `text-foreground`, `border-border`
- Never hardcode: `bg-white`, `text-gray-900`, `dark:bg-gray-900`

## Available Scripts

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `bun run dev`          | Start dev server (auto-kills port 3000 via `predev`)       |
| `bun run build`        | Production build                                           |
| `bun run start`        | Production server                                          |
| `bun run lint`         | ESLint                                                     |
| `bun run clone <name>` | Full clone (`.github/`, docs, everything)                  |
| `bunx prisma generate` | Regenerate Prisma client after schema changes              |
| `bunx prisma db push`  | Push schema to database                                    |

## Deployment

> ⚠️ **Prisma 7 Deployment Note**: To ensure the Prisma client is successfully generated during Vercel's isolated build phase, the production build command must explicitly target the schema file before running the Next.js compiler. This is fully automated in `package.json` via the script: `"build": "prisma generate --schema=./prisma/schema.prisma && next build"`.

### Vercel

```bash
bun run build  # Build command
bun run start  # Start command
```

Set environment variables in Vercel dashboard:

- `DATABASE_URL` (pooled)
- `DIRECT_URL` (direct — used only via prisma.config.ts locally)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BASE_URL`

> Prisma migrations must be run manually or via a migration script. `prisma db push` is not run during build.

## Keep Database Alive (Supabase Free Tier)

Supabase free tier **hibernates** databases after 7 days of inactivity. A GitHub Actions workflow pings the database daily to prevent this.

### How it works

```
GitHub Actions (daily 06:00 UTC) → curl → Supabase REST API (profiles table)
```

### Setup

1. Add these **secrets** in your repo: Settings → Secrets and variables → Actions:

   | Secret              | Value                                                 |
   | ------------------- | ----------------------------------------------------- |
   | `SUPABASE_URL`      | Your `NEXT_PUBLIC_SUPABASE_URL`                       |
   | `SUPABASE_ANON_KEY` | Your `NEXT_PUBLIC_SUPABASE_ANON_KEY`                  |

2. Trigger manually: Actions → "Supabase Keep Alive" → "Run workflow"

> **Note**: The workflow is available only in the boilerplate repository. It is **excluded** from scaffolded projects by the CLI's `filterFunc`.

## Known Gotchas

| Issue                                       | Cause                                                                       | Workaround / Fix                                                                                                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dynamic locale imports fail                 | Next.js bundler optimization issues with nested structures                  | **Fixed**: Resolved by migrating to clean static imports mapped via a TypeScript record in `src/i18n/request.ts`.                                                           |
| `middleware.ts` overwrites next-intl locale | Supabase `NextResponse.next()` wipes internal request rewrites/headers      | **Fixed**: Pass next-intl's `response` as the `baseResponse` parameter into Supabase's `createClient(request, response)` to successfully merge headers and session cookies. |
| React Hook `useId` called conditionally     | Using `id ?? React.useId()` triggers an implicit conditional hook execution | **Fixed**: Always call `const generatedId = React.useId();` unconditionally at the very top of atomic UI components, then assign `id ?? generatedId`.                       |
| `dark:` variants don't work                 | Tailwind v4 CSS-first architecture                                          | Use `isDark` from `useTheme()` + `cn()` for conditional styles.                                                                                                             |
| `middleware.ts` deprecation warning         | Next.js prefers `proxy.ts`                                                  | Blocked by next-intl, non-blocking.                                                                                                                                         |
| next-intl navigation hooks                  | Requires `createNavigation()`                                               | Import from `@/i18n/navigation`.                                                                                                                                            |
| Prisma schema `url` error                   | Prisma 7 removed url from schema                                            | Use `prisma.config.ts`.                                                                                                                                                     |
| PrismaClient import error                   | IDE cache                                                                   | Restart TS Server (Cmd+Shift+P).                                                                                                                                            |

## Pending Implementation

- [ ] Dashboard sidebar
- [ ] Avatar component (consolidated)
- [ ] Radix UI primitives (Tooltip, Dropdown, Select, Tabs)
- [ ] Table with sorting
- [ ] Error pages (404, 500)
- [x] User profile page
- [x] OAuth (Google, GitHub sign-in)
- [ ] Test framework (Vitest/Jest + Playwright)

## Noteworthy

- No test framework configured yet
- No TypeScript typecheck script — relies on IDE
- `bun run dev` uses `turbopack` by default
- Prettier import order: `react` → `next` → third-party → `@/features/` → `@/components/` → `@/lib/` → relative
- All components use **named exports only** (no default exports except Next.js pages)

---

## Contact

For questions or suggestions:

- **GitHub:** [github.com/mmgonnar](https://github.com/mmgonnar)
- **LinkedIn:** [linkedin.com/in/mmgonnar](https://www.linkedin.com/in/mmgonnar/)
- **Email:** [mmgonnar@gmail.com](mailto:mmg.onnar@gmail.com)
- **Twitter:** [@mmgonnar](https://x.com/mmgonnar)

Your feedback and contributions are welcome! This project aims to make teaching more efficient and enjoyable.
