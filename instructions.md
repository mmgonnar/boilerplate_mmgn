Act as a Senior Software Architect and Lead Frontend Engineer. I am going to provide you with my project's codebase. Your goal is to perform a deep architectural audit and establish a "Source of Truth" for future development.

---

## Task 1: Code & Architecture Audit

Analysis: Review my current file structure (feature-based), naming conventions, and component architecture.

Principles: Identify how I implement Clean Code and DRY (Don't Repeat Yourself) principles. Look for patterns in how I handle state, props, and Tailwind utility classes.

Component Reusability: Analyze my existing UI components (Buttons, Inputs, Cards) to understand how to extend them without creating technical debt.

---

## Task 2: Project Context Documentation (PROJECT_CONTEXT.md)

Create a comprehensive PROJECT_CONTEXT.md file that serves as the definitive guide for any AI or developer working on this repo. Include:

Technical Stack: Detailed list (Next.js 16, Tailwind CSS 4, next-intl, Supabase, Prisma).

Architecture Overview: Explanation of the folder structure and where specific logic (hooks, services, components, i18n) resides.

Coding Standards: Explicit rules for naming, component declaration, and API integration patterns.

i18n Setup: next-intl configuration, feature-based translations, locale detection.

Deployment & Environments: Current setup for Vercel, Supabase, or other integrations.

---

## Task 3: Implementation Strategy

Based on this audit, tell me how you will approach creating new features to ensure 100% visual and functional consistency with what is already built.

STRICT RULE: Always reference PROJECT_CONTEXT.md before making any decisions or creating new code.

---

## Current Project State

### Completed

- ✅ Next.js 16 with App Router
- ✅ Tailwind CSS 4 with custom theme
- ✅ Feature-based architecture
- ✅ UI Components (Button, Input, Card, Badge, etc.)
- ✅ Dark/Light mode theming
- ✅ next-intl v4 i18n setup
- ✅ Locale routing (/en/, /es/)
- ✅ Feature translations (navigation, auth, dashboard)

### In Progress / Pending

- [ ] Locale switcher component
- [ ] Prisma + Supabase setup
- [ ] Auth integration
- [ ] Dashboard layout

---

## i18n Implementation Notes

- All routes under `[locale]` segment: `/en/...`, `/es/...`
- Feature translations: `features/*/messages/`
- Root translations: `messages/`
- Locale detection: URL path → Cookie → Accept-Language → Default (es)
- Use `getTranslations()` in Server Components, `useTranslations()` in Client Components