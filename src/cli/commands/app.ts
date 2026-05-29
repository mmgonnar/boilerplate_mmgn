import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as pc from 'picocolors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateDir = path.resolve(__dirname, '../../..');

const LANDING_DELETIONS = [
  'features/profile',
  'features/auth',
  'features/(items)',
  'app/[locale]/(auth)',
  'app/[locale]/(dashboard)',
  'prisma',
  'prisma.config.ts',
  'supabase_setup.sql',
];

const LANDING_NAV_CONFIG = `interface FooterColumnType {
  title: string;
  links: { label: string; href: string }[];
}

export const APP_MODE = {
  variant: 'landing',
};

export const NAV_CONFIG = {
  public: [
    { label: 'home', href: '/' },
    { label: 'about', href: '/about' }
  ],
  authenticated: []
};

export const FOOTER_LINKS: FooterColumnType[] = [
  {
    title: 'product',
    links: [
      { label: 'features', href: '/features' },
      { label: 'pricing', href: '/pricing' },
      { label: 'changelog', href: '/changelog' },
    ],
  },
  {
    title: 'company',
    links: [
      { label: 'about', href: '/about' },
      { label: 'blog', href: '/blog' },
      { label: 'careers', href: '/careers' },
    ],
  },
  {
    title: 'legal',
    links: [
      { label: 'privacy', href: '/privacy' },
      { label: 'terms', href: '/terms' },
    ],
  },
];
`;

const LANDING_I18N_REQUEST = `import { getRequestConfig } from 'next-intl/server';

import commonEn from '@/messages/en.json';
import commonEs from '@/messages/es.json';
import navigationEn from '@/features/navigation/messages/en.json';
import navigationEs from '@/features/navigation/messages/es.json';

import { routing } from './routing';

const messages: Record<string, Record<string, any>> = {
  en: { ...commonEn, ...navigationEn },
  es: { ...commonEs, ...navigationEs },
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'es' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale] || messages[routing.defaultLocale],
  };
});
`;

export async function runApp() {
  intro(pc.bgBlack(pc.white(' 🏛️ MMGN BOILERPLATE CLI (2026) ')));

  const projectName = await text({
    message: '¿Cómo se llamará tu nuevo proyecto?',
    placeholder: 'my-awesome-app',
    validate(value) {
      if (value.trim().length === 0) return 'El nombre del proyecto es requerido';
    },
  });

  if (isCancel(projectName)) {
    cancel('Operación cancelada.');
    process.exit(0);
  }

  const variant = await select({
    message: 'Selecciona la variante que necesitas:',
    options: [
      {
        value: 'dashboard',
        label: '🚀 Dashboard Completo',
        hint: 'Auth + i18n + Storage + CRUD',
      },
      {
        value: 'landing',
        label: '🎨 Solo Landing Page',
        hint: 'Remueve Supabase, Auth y rutas privadas',
      },
    ],
  });

  if (isCancel(variant)) {
    cancel('Operación cancelada.');
    process.exit(0);
  }

  const s = spinner();
  s.start('Clonando y configurando tu boilerplate...');

  const targetDir = path.join(process.cwd(), projectName as string);

  try {
    const filterFunc = (src: string, _dest: string) => {
      const basename = path.basename(src);

      if (src.startsWith(targetDir)) return false;
      if (basename === 'node_modules') return false;
      if (basename === '.git') return false;
      if (basename === '.next') return false;
      if (basename === '.agents') return false;
      if (basename === '.DS_Store') return false;
      if (basename === '.env' && src !== path.join(templateDir, '.env.example')) return false;

      return true;
    };

    await fs.copy(templateDir, targetDir, { filter: filterFunc });

    await fs.copy(
      path.join(templateDir, '.env.example'),
      path.join(targetDir, '.env'),
    );

    if (variant === 'landing') {
      s.message('Purificando plantilla (Solo Landing Page)...');

      for (const file of LANDING_DELETIONS) {
        await fs.remove(path.join(targetDir, file));
      }

      const pkgPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);

        pkg.name = projectName;

        if (pkg.dependencies) delete pkg.dependencies['@prisma/client'];
        if (pkg.devDependencies) delete pkg.devDependencies['prisma'];
        if (pkg.scripts) {
          delete pkg.scripts['db:generate'];
          delete pkg.scripts['db:push'];
        }

        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }

      const navConfigPath = path.join(
        targetDir,
        'features/navigation/utils/config.ts',
      );
      await fs.outputFile(navConfigPath, LANDING_NAV_CONFIG);

      const i18nPath = path.join(targetDir, 'i18n/request.ts');
      await fs.outputFile(i18nPath, LANDING_I18N_REQUEST);
    } else {
      const pkgPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);
        pkg.name = projectName;
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }
    }

    s.stop('¡Proyecto configurado con éxito!');

    outro(
      `${pc.green('Siguientes pasos:')}\n` +
      `${pc.gray('cd')} ${pc.white(projectName as string)}\n` +
      `${pc.gray('bun install')}\n` +
      `${pc.gray('bun run dev')}`,
    );
  } catch (error) {
    s.stop('Ocurrió un error durante la configuración.');
    console.error(pc.red(String(error)));
    process.exit(1);
  }
}
