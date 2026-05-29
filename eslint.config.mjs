import { FlatCompat } from '@eslint/eslintrc';
import importX from 'eslint-plugin-import-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  // Base configuration layers
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Global project ignores
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // 📦 Architecture & Import Order Validation
  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      // Enforce strict feature-driven encapsulation and UI barrel exports
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
              group: ['@/components/ui/*'],
              message:
                'Forbidden atomic UI import. Please use the unified barrel export instead: import { ... } from "@/components/ui".',
            },
          ],
        },
      ],

      // Automate precise import ordering sequence
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
            { pattern: '@/features/**', group: 'internal', position: 'before' },
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'after',
            },
            { pattern: '@/lib/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },

  // 🔍 SEO Metadata Validation Layer (App Router Pages Only)
  {
    files: ['**/app/**/page.tsx', '**/app/**/page.ts'],
    rules: {
      // Enforce mandatory export of 'metadata' or 'generateMetadata' in router pages
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
]);

export default eslintConfig;
