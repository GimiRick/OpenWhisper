import fs from 'fs';
import path from 'path';
import { WHISPER_MODELS, DEFAULT_PATHS } from '../constants/defaults.js';
import { ensureDirectoriesExist } from '../helpers/paths.js';

export function getAllWhisperModels() {
  return WHISPER_MODELS;
}

export function getInstalledWhisperModels() {
  ensureDirectoriesExist();
  const modelsDir = DEFAULT_PATHS.modelsDir;
  if (!fs.existsSync(modelsDir)) return [];

  const files = fs.readdirSync(modelsDir);
  return WHISPER_MODELS.filter(model => files.includes(model.filename)).map(model => {
    const filePath = path.join(modelsDir, model.filename);
    const stats = fs.statSync(filePath);
    return {
      ...model,
      installed: true,
      actualSizeBytes: stats.size,
      installedPath: filePath
    };
  });
}

export function getWhisperModelByFilename(filename) {
  return WHISPER_MODELS.find(m => m.filename === filename) || {
    id: filename,
    name: filename,
    filename: filename,
    recommended: false,
    url: ''
  };
}
