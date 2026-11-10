import { confirm, isCancel } from '@clack/prompts';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as pc from 'picocolors';

export async function runEnv(templateDir: string) {
  const envSource = path.join(templateDir, '.env');
  const envTarget = path.join(process.cwd(), '.env');

  if (!(await fs.pathExists(envSource))) {
    console.error(pc.red('❌ .env not found in the template.'));
    console.error(pc.dim('This command only works locally (the .env is not published to npm).'));
    process.exit(1);
  }

  // Overwriting a filled-in .env silently would cost someone their local secrets.
  if (await fs.pathExists(envTarget)) {
    const shouldOverwrite = await confirm({
      message: 'This project already has a .env. Overwrite it?',
      initialValue: false,
    });

    if (isCancel(shouldOverwrite) || !shouldOverwrite) {
      console.log(pc.yellow('Kept the existing .env, nothing was copied.'));
      process.exit(0);
    }
  }

  await fs.copy(envSource, envTarget);
  console.log(pc.green('✅ .env copied to current project'));
}
