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

const LANDING_DELETIONS = [
  'features/profile',
  'features/auth',
  'features/feature-demo',
  'features/dashboard',
  'app/[locale]/(auth)',
  'app/[locale]/(dashboard)',
  'app/auth',
  'lib/prisma.ts',
  'prisma',
  'prisma.config.ts',
  'supabase_setup.sql',
];

const LANDING_NAV_CONFIG = `type FooterColumnType = {
  title: string;
  links: { label: string; href: string }[];
};

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

const LANDING_I18N_REQUEST = `import type { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import commonEn from '@/messages/en.json';
import commonEs from '@/messages/es.json';
import navigationEn from '@/features/navigation/messages/en.json';
import navigationEs from '@/features/navigation/messages/es.json';

import { routing } from './routing';

const messages: Record<string, AbstractIntlMessages> = {
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

const VARIANTS = ['dashboard', 'landing'] as const;

type Variant = (typeof VARIANTS)[number];

type AppFlags = {
  name?: string;
  variant?: string;
};

function isVariant(value: string): value is Variant {
  return (VARIANTS as readonly string[]).includes(value);
}

// The name becomes the "name" field of the generated package.json, so it has
// to satisfy npm: lowercase, no spaces, no leading dot or underscore.
const NPM_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;

function describeNameProblem(value: string): string | undefined {
  if (value.length === 0) return 'Project name is required';
  if (value.length > 214) {
    return 'Project name must be 214 characters or fewer';
  }
  if (!NPM_NAME_PATTERN.test(value)) {
    return 'Project name must be a valid npm package name: lowercase letters, digits, dots, hyphens and underscores, starting with a letter or a digit';
  }

  return undefined;
}

export async function runApp(templateDir: string, flags: AppFlags = {}) {
  // Checked before the intro so a bad flag fails plainly, with no half-drawn prompt.
  if (flags.variant !== undefined && !isVariant(flags.variant)) {
    console.error(
      pc.red(
        `Invalid --variant "${flags.variant}". Expected one of: ${VARIANTS.join(', ')}.`,
      ),
    );
    process.exit(1);
  }

  const pkg = await fs.readJson(
    path.resolve(templateDir, 'package.json'),
  );
  intro(
    pc.bgBlack(
      pc.white(` 🏛️ MMGN BOILERPLATE CLI v${pkg.version} `),
    ),
  );

  let projectName: string;

  if (flags.name !== undefined) {
    projectName = flags.name.trim();
    const problem = describeNameProblem(projectName);

    if (problem) {
      // Flag mode has nobody to re-ask, so a bad --name is fatal.
      console.error(pc.red(`Invalid --name "${flags.name}". ${problem}.`));
      process.exit(1);
    }
  } else {
    const answer = await text({
      message: 'What will your new project be called?',
      placeholder: 'my-awesome-app',
      validate(value) {
        // Returning a string keeps the prompt open and shows the reason.
        return describeNameProblem(value.trim());
      },
    });

    if (isCancel(answer)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }

    projectName = (answer as string).trim();
  }

  let variant: Variant;

  if (flags.variant !== undefined && isVariant(flags.variant)) {
    variant = flags.variant;
  } else {
    const answer = await select({
      message: 'Select the variant you need:',
      options: [
        {
          value: 'dashboard',
          label: '🚀 Full Dashboard',
          hint: 'Auth + i18n + Storage + CRUD',
        },
        {
          value: 'landing',
          label: '🎨 Landing Page Only',
          hint: 'Removes Supabase, Auth and private routes',
        },
      ],
    });

    if (isCancel(answer)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }

    variant = answer as Variant;
  }

  const targetDir = path.join(process.cwd(), projectName);

  // Refuse before the first write, so a second run cannot half-overwrite a project.
  if (await fs.pathExists(targetDir)) {
    const existingEntries = await fs.readdir(targetDir);

    if (existingEntries.length > 0) {
      console.error(
        pc.red(
          `Target directory "${projectName}" already exists and is not empty. Nothing was changed.`,
        ),
      );
      process.exit(1);
    }
  }

  const s = spinner();
  s.start('Cloning and configuring your boilerplate...');

  try {
    const filterFunc = (src: string, _dest: string) => {
      const basename = path.basename(src);

      if (src.startsWith(targetDir)) return false;
      // CLI sources and build output belong to the npm package, not to apps.
      if (src === path.join(templateDir, 'src')) return false;
      if (src === path.join(templateDir, 'dist')) return false;
      if (basename === 'node_modules') return false;
      if (basename === '.git') return false;
      if (basename === '.next') return false;
      if (basename === '.agents') return false;
      if (basename === '.github') return false;
      if (basename === '.vscode') return false;
      if (basename === '.DS_Store') return false;
      if (basename === '.env' && src !== path.join(templateDir, '.env.example')) return false;
      if (basename === 'bun.lock') return false;
      if (basename === 'package-lock.json') return false;
      if (basename === 'next-env.d.ts') return false;
      if (basename === 'tsconfig.tsbuildinfo') return false;
      if (basename === 'AGENTS.md') return false;
      if (basename === 'PROJECT_CONTEXT.md') return false;
      if (basename === 'instructions.md') return false;
      if (basename === 'skills-lock.json') return false;

      return true;
    };

    await fs.copy(templateDir, targetDir, { filter: filterFunc });

    await fs.copy(
      path.join(templateDir, '.env.example'),
      path.join(targetDir, '.env'),
    );

    // npm strips .gitignore from published tarballs, so the template ships
    // as "gitignore" and gets its dot back here.
    const gitignoreTemplate = path.join(targetDir, 'gitignore');
    if (await fs.pathExists(gitignoreTemplate)) {
      await fs.move(gitignoreTemplate, path.join(targetDir, '.gitignore'), {
        overwrite: true,
      });
    }

    if (variant === 'landing') {
      s.message('Cleaning template (Landing Page Only)...');

      for (const file of LANDING_DELETIONS) {
        await fs.remove(path.join(targetDir, file));
      }

      const pkgPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);

        pkg.name = projectName;

        if (pkg.dependencies) {
          delete pkg.dependencies['@prisma/client'];
          delete pkg.dependencies['@prisma/adapter-pg'];
          delete pkg.dependencies['pg'];
          delete pkg.dependencies['prisma'];
        }
        if (pkg.devDependencies) {
          delete pkg.devDependencies['prisma'];
          delete pkg.devDependencies['@types/pg'];
        }
        if (pkg.scripts) {
          delete pkg.scripts['postinstall'];
          delete pkg.scripts['db:generate'];
          delete pkg.scripts['db:push'];
          // The dashboard build runs prisma generate first; landing has no Prisma.
          pkg.scripts['build'] = 'next build';
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

    // The generated app is a project, not a publishable copy of this CLI:
    // drop the npm packaging fields and the CLI's own scripts.
    const pkgPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);

      pkg.private = true;
      pkg.version = '0.1.0';
      delete pkg.bin;
      delete pkg.files;
      delete pkg.repository;
      delete pkg.bugs;
      delete pkg.homepage;
      delete pkg.keywords;

      // The CLI's own runtime deps; the generated app never prompts,
      // colors terminal output, or copies template files.
      if (pkg.dependencies) {
        delete pkg.dependencies['@clack/prompts'];
        delete pkg.dependencies['fs-extra'];
        delete pkg.dependencies['picocolors'];
      }
      if (pkg.devDependencies) {
        delete pkg.devDependencies['@types/fs-extra'];
      }

      if (pkg.scripts) {
        delete pkg.scripts['build:cli'];
        delete pkg.scripts['clone'];
        delete pkg.scripts['predev'];
        delete pkg.scripts['prepublishOnly'];
        delete pkg.scripts['mmgn'];
        if (typeof pkg.scripts['build'] === 'string') {
          pkg.scripts['build'] = pkg.scripts['build'].replace(
            /^bun run build:cli && /,
            '',
          );
        }
      }

      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    s.stop('Project configured successfully!');

    outro(
      `${pc.green('Next steps:')}\n` +
      `${pc.gray('cd')} ${pc.white(projectName as string)}\n` +
      `${pc.gray('bun install')}\n` +
      `${pc.gray('bun run dev')}`,
    );
  } catch (error) {
    s.stop('An error occurred during configuration.');
    console.error(pc.red(String(error)));
    process.exit(1);
  }
}
