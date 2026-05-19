## Commands

```bash
bun run dev      # kills existing port 3000 first via predev
bun run build    # Next.js production build
bun run lint     # ESLint only (no typecheck script)
bun run start    # production server
bunx prisma generate  # Regenerate Prisma client
bunx prisma db push   # Push schema to database
```

## Key Stack

- Next.js 16.2.2 (App Router) — Turbopack enabled by default
- React 19.2.4
- TypeScript 5.x strict mode
- Tailwind CSS v4 (no tailwind.config.js — configured via globals.css @theme)
- next-intl 3.26.5 — pinned, incompatible with Next.js 16 at v4
- next-themes 0.4.6 — dark/light mode
- react-hook-form + zod — forms and validation
- class-variance-authority (CVA) — component variants
- lucide-react — icons
- Prettier with import sorting plugin
- Prisma 7 + @prisma/adapter-pg — database ORM
- Supabase Auth + @supabase/ssr — authentication

## Architecture

- Routes: `app/[locale]/` with route groups `(auth)`, `(marketing)`, `(dashboard)`
- Components: `components/ui/` (custom shadcn-style primitives)
- Features: `features/[name]/` — components, types, utils, messages, index.ts (Barrel Export (Strictly named exports).)
- Utils: `lib/utils.ts` (cn via clsx + tailwind-merge)
- Supabase: `lib/supabase/` — client.ts (browser), server.ts (server), middleware.ts (middleware)
- Prisma: `lib/prisma.ts` (singleton client), `prisma/schema.prisma` (models)
- Providers: `providers/` — theme-provider.tsx, auth-provider.tsx
- i18n config: `i18n/request.ts`, `i18n/routing.ts`
- Locale middleware: `middleware.ts` (proxy.ts convention pending next-intl support)

## Dark Mode Rules

- `dark:` Tailwind variants are UNRELIABLE in v4 — never use them
- Always use `isDark` from `useTheme()` + `cn()` for conditional dark styles
- Semantic tokens only: `bg-background`, `text-foreground`, `border-border`
- Never hardcode: `bg-white`, `text-gray-900`, `dark:bg-gray-900`
- eg: `className={cn("bg-white", isDark && "bg-neutral-900")}`

## Theming

- Dark/light via CSS custom properties in `app/globals.css`
- Tokens defined in `@theme {}` block
- All components must use semantic color tokens

## i18n Rules

- next-intl pinned to 3.26.5 — do NOT upgrade (breaks with Next.js 16)
- Static imports only in `i18n/request.ts` — dynamic imports broken in Next.js 16
- Client import: `useTranslations` from `'next-intl'` (not `'next-intl/client'`)
- Server import: `getTranslations` from `'next-intl/server'`
- Feature translations: `features/[name]/messages/en.json` + `es.json`
- Root translations: `messages/en.json` + `es.json`
- Supported locales: `['es', 'en']`, default: `'es'`
- Detection priority: URL → cookie → Accept-Language header → default

## Prettier Import Order

1. `^react` → `^next` → `<THIRD_PARTY_MODULES>` → `^@/features/` → `^@/components/` → `^@/lib/` → `^[./]`

## Component Architecture

- **Co-location**: Subcomponents defined in same file as parent (e.g. `NavLinks`, `HeaderActions` inside `header.tsx`)
- **CVA pattern**: All variant components use `cva()` + `VariantProps` + `forwardRef`
- **Polymorphic Button**: Renders `<button>` or `<Link>` based on `href` prop
- **DRY**: Shared interfaces extracted (e.g. `HeaderActionsProps`)
- **Features-first**: Feature code in `features/` with co-located components, types, utils, messages
- **Barrel exports**: Every `features/[name]/index.ts` and `components/ui/index.ts`
- **No default exports** in components — named exports only (except Next.js pages)

## Known Gotchas

| Issue                               | Cause                         | Workaround                         |
| ----------------------------------- | ----------------------------- | ---------------------------------- |
| `dark:` variants don't work         | Tailwind v4 CSS-first         | Use `isDark` + `cn()`              |
| next-intl v4 crashes                | Next.js 16 incompatible       | Pinned to 3.26.5                   |
| Dynamic locale imports fail         | Next.js 16 bundler            | Static imports in `request.ts`     |
| `middleware.ts` deprecation warning | Next.js 16 prefers `proxy.ts` | Blocked by next-intl, non-blocking |
| next-intl navigation hooks          | Requires createNavigation()   | Import from `@/i18n/navigation`    |
| Prisma schema `url` error           | Prisma 7 removed url from schema | Use `prisma.config.ts` instead   |
| PrismaClient import error          | IDE cache issue               | Restart TS Server (Cmd+Shift+P)   |

## Prisma 7 Configuration

- Schema: `prisma/schema.prisma` — no `url`/`directUrl` (in config.ts)
- Config: `prisma.config.ts` — datasource URL for migrations
- Client: `lib/prisma.ts` — uses `@prisma/adapter-pg` with `Pool`
- Generate: `bunx prisma generate` after schema changes
- Push: `bunx prisma db push` (uses DIRECT_URL in prisma.config.ts)

## Pending Implementation

- [x] Prisma setup + Supabase connection
- [x] Supabase Auth (login, register, session)
- [x] Middleware route protection
- [ ] Dashboard sidebar
- [ ] Avatar component
- [ ] Radix UI primitives (Tooltip, Dropdown, Select, Tabs)
- [ ] Toast (react-hot-toast)
- [ ] Table with sorting
- [ ] Error pages (404, 500)
- [ ] SEO: generateMetadata per page
- [ ] User profile page

## Noteworthy

- No test framework configured
- No typecheck script — relies on IDE
- `predev` script auto-kills port 3000 before starting dev server
