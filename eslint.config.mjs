import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  // Base configuration layers from Next.js and TS
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Global project ignores
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // 📦 1. Global Architecture Guardrails (Strict Barrel Exports)
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/**'],
              message:
                'Forbidden deep import. Please consume this member through the public feature entry point: import { ... } from "@/features/feature-name".',
            },
            {
              group: ['@/components/ui/**'],
              message:
                'Forbidden atomic UI import. Please use the unified barrel export instead: import { ... } from "@/components/ui".',
            },
          ],
        },
      ],

      // Named Exports Enforcement
      'import/no-default-export': 'error',

      // React 19 Hook Safety
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript Consistency Guardrails
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // 🔍 2. Exclusive Server-Side Guardrails (App Router Routing & Message Constraints)
  {
    // 🚀 OJO AQUÍ: Solo aplica a archivos .ts y .tsx dentro de tu routing de servidor
    files: ['**/app/**/*.ts', '**/app/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/**'],
              message:
                'Forbidden deep import. Please consume this member through the public feature entry point: import { ... } from "@/features/feature-name".',
            },
            {
              group: ['@/components/ui/**'],
              message:
                'Forbidden atomic UI import. Please use the unified barrel export instead: import { ... } from "@/components/ui".',
            },
          ],
          paths: [
            {
              name: 'next-intl',
              importNames: ['useTranslations', 'useLocale', 'useTimeZone'],
              message:
                '🚨 Server-side context validation: "useTranslations" can only be used inside Client Components ("use client"). For Server Components, import "getTranslations" from "next-intl/server" instead.',
            },
          ],
        },
      ],
    },
  },

  // 🔓 3. Client-Side Bypass Overrides (Allows hooks safely in Client Components)
  {
    // 🚀 Buscamos específicamente componentes que pertenezcan a tus features o UI que son clientes nativos
    files: ['**/components/ui/**/*.tsx', '**/features/**/components/**/*.tsx'],
    rules: {
      // Re-declaramos no-restricted-imports sin el bloqueo de paths de next-intl
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/**'],
              message:
                'Forbidden deep import. Please consume this member through the public feature entry point: import { ... } from "@/features/feature-name".',
            },
            {
              group: ['@/components/ui/**'],
              message:
                'Forbidden atomic UI import. Please use the unified barrel export instead: import { ... } from "@/components/ui".',
            },
          ],
        },
      ],
    },
  },

  // 🎯 4. Custom Exception: Allow default exports ONLY for Next.js routing/config files
  {
    files: [
      '**/app/**/page.tsx',
      '**/app/**/layout.tsx',
      '**/app/**/route.ts',
      '**/middleware.ts',
      '**/next.config.ts',
      'eslint.config.mjs',
      '**/sitemap.ts',
      '**/robots.ts',
      '**/postcss.config.mjs',
      '**/prisma.config.ts',
      '**/i18n/request.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // 🔍 5. SEO Metadata Validation Layer (App Router Pages Only)
  {
    files: ['**/app/**/page.tsx', '**/app/**/page.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'Program:not(:has(ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > Identifier[name="metadata"])):not(:has(ExportNamedDeclaration > FunctionDeclaration > Identifier[name="generateMetadata"]))',
          message:
            '🚨 SEO Enforcement Error: Every page.tsx within the App Router must explicitly export a "metadata" object or a "generateMetadata" function.',
        },
      ],
    },
  },
  {
    files: ['**/i18n/request.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
]);

export default eslintConfig;
