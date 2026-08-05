import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { getInstalledWhisperModels } from '../models/whisper-models.js';
import { configManager } from '../config/config-manager.js';
import { DEFAULT_PATHS } from '../constants/defaults.js';
import { theme } from '../ui/theme.js';

export async function executeRemoveWhisper() {
  const installedModels = getInstalledWhisperModels();

  if (installedModels.length === 0) {
    console.log(theme.warning('\nNo installed Whisper models to remove.'));
    return;
  }

  const choices = installedModels.map(m => ({
    name: `${m.name} (${m.filename})`,
    value: m
  }));

  const { targetModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'targetModel',
      message: 'Select installed Whisper model to delete:',
      choices
    }
  ]);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to delete ${targetModel.filename} from disk?`,
      default: false
    }
  ]);

  if (confirm) {
    const filePath = path.join(DEFAULT_PATHS.modelsDir, targetModel.filename);
    let removed = false;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      removed = true;
    }

    // Reset current if removed
    if (configManager.getCurrentWhisperModel() === targetModel.filename) {
      const remaining = getInstalledWhisperModels();
      configManager.setCurrentWhisperModel(remaining.length > 0 ? remaining[0].filename : '');
    }

    if (removed) {
      console.log(theme.success(`✔ Deleted ${targetModel.filename} from disk.`));
    } else {
      console.log(theme.warning(`File ${targetModel.filename} was already absent.`));
    }
  } else {
    console.log(theme.muted('Operation cancelled.'));
  }
}
