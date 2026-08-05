// Cross-platform syntax checker for the whole project.
//
// `node --check` only validates a single file, so invoking it with the
// shell-globbed list (e.g. `test/*.test.js`) silently skips everything after
// the first argument and breaks under cmd.exe. Walking the tree and checking
// each file individually keeps `npm run lint` / `npm run build` reliable on
// Windows, macOS, and Linux.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = ['index.js', 'bin', 'src', 'test', 'scripts'];

function collectFiles(entry) {
  if (entry.endsWith('.js')) {
    return [fs.existsSync(entry) ? entry : null].filter(Boolean);
  }
  const full = path.join(projectRoot, entry);
  if (!fs.existsSync(full)) return [];
  const files = [];
  const walk = (dir) => {
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = path.join(dir, dirent.name);
      if (dirent.isDirectory()) walk(child);
      else if (dirent.name.endsWith('.js')) files.push(child);
    }
  };
  walk(full);
  return files;
}

const files = roots.flatMap(collectFiles);
let failed = 0;

for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'ignore' });
  } catch {
    console.error(`Syntax error in ${file}`);
    failed = 1;
  }
}

if (failed) {
  console.error(`Syntax check failed (${failed} file(s) with errors).`);
  process.exit(1);
}

console.log(`Syntax OK (${files.length} file(s) checked).`);