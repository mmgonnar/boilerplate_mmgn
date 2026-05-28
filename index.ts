import { intro, select, text, outro, spinner } from '@clack/prompts';
import color from 'picocolors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.clear();
  
  // Banner de inicio minimalista
  intro(color.bgBlack(color.white(' 🏛️  MMGN BOILERPLATE CLI (2026) ')));

  // 1. Preguntar el nombre del nuevo proyecto
  const projectName = await text({
    message: '¿Cómo se llamará tu nuevo proyecto?',
    placeholder: 'my-awesome-app',
    validate(value) {
      if (value.trim().length === 0) return 'El nombre es obligatorio.';
    },
  });

  if (typeof projectName === 'symbol') return;

  // 2. Preguntar la variante de arquitectura
  const projectType = await select({
    message: 'Selecciona la variante de infraestructura:',
    options: [
      { value: 'full', label: '🚀 Dashboard Completo', hint: 'Auth + i18n + Storage + CRUD (Prisma + Supabase)' },
      { value: 'landing', label: '🎨 Solo Landing Page', hint: 'Purifica el proyecto: remueve DB, Auth y vistas privadas' },
    ],
  });

  if (typeof projectType === 'symbol') return;

  const s = spinner();
  s.start('Generando entorno de desarrollo estructurado...');

  // Configuración de rutas (Asumiendo que el boilerplate está en ../templates/next-boilerplate)
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '../templates/next-boilerplate');

  // Verificar que el molde exista antes de clonar
  if (!(await fs.pathExists(templateDir))) {
    s.stop(color.red('Error crítico: No se encontró la carpeta del template base.'));
    return;
  }

  // Clonar todo el boilerplate a la nueva carpeta destino
  await fs.copy(templateDir, targetDir);

  // 🚀 LÓGICA DE PURIFICACIÓN: Si eligió solo Landing Page
  if (projectType === 'landing') {
    s.message('Purificando módulos y dependencias pesadas...');

    // 1. Remover directorios de backend, auth y dashboard
    const pathsToDelete = [
      'src/features/profile',
      'src/features/auth',
      'src/features/(items)',
      'src/app/[locale]/(auth)',
      'src/app/[locale]/(dashboard)',
      'prisma',
      'prisma.config.ts',
      'supabase_setup.sql'
    ];

    for (const p of pathsToDelete) {
      await fs.remove(path.join(targetDir, p));
    }

    // 2. Mutar el package.json para alivianar el proyecto
    const pkgPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      
      // Renombrar proyecto
      pkg.name = projectName;
      
      // Podar Prisma de las dependencias
      if (pkg.dependencies) delete pkg.dependencies['@prisma/client'];
      if (pkg.devDependencies) delete pkg.devDependencies['prisma'];
      if (pkg.scripts) {
        delete pkg.scripts['db:generate'];
        delete pkg.scripts['db:push'];
      }

      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // 3. Sobreescribir la navegación global a un estado plano sin Auth
    const configPath = path.join(targetDir, 'src/features/navigation/utils/config.ts');
    const landingConfigContent = `export const APP_MODE = { variant: 'landing' };
export const NAV_CONFIG = {
  public: [
    { label: 'home', href: '/' },
    { label: 'about', href: '/about' }
  ],
  authenticated: []
};
`;
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, landingConfigContent, 'utf-8');
  } else {
    // Si es Full Dashboard, solo actualizamos el nombre en el package.json
    const pkgPath = path.join(targetDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }
  }

  s.stop('¡Estructura de proyecto configurada con éxito! 🎉');

  // Mensaje final con instrucciones claras de arranque
  outro(`
  ${color.bold(color.green('¡Listo para tirar código!')}
  
  ${color.dim('Corre los siguientes comandos para iniciar:')}
  cd ${color.cyan(projectName)}
  bun install
  bun run dev
  `);
}

main().catch((err) => {
  console.error(color.red('\n❌ Ocurrió un error inesperado durante la automatización:'), err);
});