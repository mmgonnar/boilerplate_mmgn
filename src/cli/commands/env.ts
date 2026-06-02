import * as fs from 'fs-extra';
import * as path from 'path';
import * as pc from 'picocolors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateDir = path.resolve(__dirname, '../../..');

export async function runEnv() {
  const envSource = path.join(templateDir, '.env');
  const envTarget = path.join(process.cwd(), '.env');

  if (!(await fs.pathExists(envSource))) {
    console.error(pc.red('❌ .env not found in the template.'));
    console.error(pc.dim('This command only works locally (the .env is not published to npm).'));
    process.exit(1);
  }

  await fs.copy(envSource, envTarget);
  console.log(pc.green('✅ .env copied to current project'));
}
