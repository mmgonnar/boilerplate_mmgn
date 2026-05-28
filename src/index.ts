import {
  intro,
  outro,
  text,
  select,
  spinner,
  isCancel,
  cancel,
} from '@clack/prompts';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as pc from 'picocolors';

async function main() {
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

  const cwd = process.cwd();
  const targetDir = path.join(cwd, projectName as string);
  const templateDir = cwd;

  try {
    // Copiar el template completo (omitiendo la propia carpeta destino, node_modules, etc)
    const filterFunc = (src: string, dest: string) => {
      const isTargetDir = src.startsWith(targetDir);
      const isNodeModules = src.includes('node_modules');
      const isGit = src.includes('.git');
      const isNext = src.includes('.next');
      const isAgents = src.includes('.agents');
      return !isTargetDir && !isNodeModules && !isGit && !isNext && !isAgents;
    };

    await fs.copy(templateDir, targetDir, { filter: filterFunc });

    if (variant === 'landing') {
      s.message('Purificando plantilla (Solo Landing Page)...');

      // 1. Borrado de Carpetas y Archivos Relacionales
      const filesToDelete = [
        'src/features/profile',
        'src/features/auth',
        'src/features/(items)',
        'src/app/[locale]/(auth)',
        'src/app/[locale]/(dashboard)',
        'prisma',
        'prisma.config.ts',
        'supabase_setup.sql',
      ];

      for (const file of filesToDelete) {
        await fs.remove(path.join(targetDir, file));
      }

      // 2. Mutación de Dependencias (package.json)
      const pkgPath = path.join(targetDir, 'package.json');
      if (await fs.pathExists(pkgPath)) {
        const pkg = await fs.readJson(pkgPath);

        pkg.name = projectName;

        if (pkg.dependencies && pkg.dependencies['@prisma/client']) {
          delete pkg.dependencies['@prisma/client'];
        }

        if (pkg.devDependencies && pkg.devDependencies['prisma']) {
          delete pkg.devDependencies['prisma'];
        }

        if (pkg.scripts) {
          delete pkg.scripts['db:generate'];
          delete pkg.scripts['db:push'];
        }

        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }

      // 3. Reemplazo de Configuración de Navegación
      const navConfigPath = path.join(
        targetDir,
        'src/features/navigation/utils/config.ts'
      );
      
      const navConfigContent = `export const APP_MODE = { variant: 'landing' };
export const NAV_CONFIG = {
  public: [
    { label: 'home', href: '/' },
    { label: 'about', href: '/about' }
  ],
  authenticated: []
};
`;
      await fs.outputFile(navConfigPath, navConfigContent);
    } else {
      // Actualizar el nombre en package.json incluso si es el dashboard completo
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
      `${pc.gray('bun run dev')}`
    );
  } catch (error) {
    s.stop('Ocurrió un error durante la configuración.');
    console.error(pc.red(String(error)));
    process.exit(1);
  }
}

main().catch(console.error);