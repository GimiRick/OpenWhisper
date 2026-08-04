import fs from 'fs';
import path from 'path';
import { DEFAULT_PATHS } from '../constants/defaults.js';

export function ensureDirectoriesExist() {
  const dirs = [
    DEFAULT_PATHS.configDir,
    DEFAULT_PATHS.logsDir,
    DEFAULT_PATHS.modelsDir,
    DEFAULT_PATHS.cacheDir,
    DEFAULT_PATHS.downloadsDir,
    DEFAULT_PATHS.binDir
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

export function getDirectorySize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let totalSize = 0;

  function readDirRecursive(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readDirRecursive(fullPath);
      } else {
        totalSize += stat.size;
      }
    }
  }

  try {
    readDirRecursive(dirPath);
  } catch {
    // Ignore permissions or transient read errors
  }

  return totalSize;
}
