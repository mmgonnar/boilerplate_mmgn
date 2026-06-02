#!/usr/bin/env bun

import { fileURLToPath } from 'url';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function showHelp() {
  console.log(`
  ${pc.bold('mmgn')} — Boilerplate scaffolding CLI

  ${pc.dim('Usage:')}
    mmgn app        ${pc.dim('Scaffold a new project')}
    mmgn env        ${pc.dim('Copy .env to current project')}
    mmgn --help     ${pc.dim('Show this help')}
    mmgn --version  ${pc.dim('Show version')}
  `);
}

async function showVersion() {
  const pkg = await fs.readJson(path.resolve(__dirname, '../../package.json'));
  console.log(pc.cyan(`mmgn v${pkg.version}`));
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'app':
      const { runApp } = await import('./commands/app');
      await runApp();
      break;
    case 'env':
      const { runEnv } = await import('./commands/env');
      await runEnv();
      break;
    case '--help':
    case '-h':
      await showHelp();
      break;
    case '--version':
    case '-v':
      await showVersion();
      break;
    case undefined:
      await showHelp();
      break;
    default:
      console.error(pc.red(`Unknown command: ${command}`));
      await showHelp();
      process.exit(1);
  }
}

main().catch(console.error);
