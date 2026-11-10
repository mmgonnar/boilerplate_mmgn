// The CLI bundle is ESM but the repo package.json has no "type", so plain node
// would read dist/cli/index.js as CommonJS and print MODULE_TYPELESS_PACKAGE_JSON.
// A package.json next to the bundle marks just that folder as ESM, which leaves
// the repo and every scaffolded project untouched.
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(repoRoot, 'dist', 'cli', 'package.json');

writeFileSync(target, `${JSON.stringify({ type: 'module' }, null, 2)}\n`);

console.log(`wrote ${target}`);
