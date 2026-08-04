import inquirer from 'inquirer';
import { getInstalledWhisperModels } from '../models/whisper-models.js';
import { configManager } from '../config/config-manager.js';
import { theme } from '../ui/theme.js';

export async function executeSwitchWhisper() {
  const installedModels = getInstalledWhisperModels();

  if (installedModels.length === 0) {
    console.log(theme.warning('\nNo Whisper models are currently installed. Please run /setup whisper first to download a model.'));
    return;
  }

  const currentModel = configManager.getCurrentWhisperModel();

  const choices = installedModels.map(m => {
    const isCurrent = m.filename === currentModel;
    return {
      name: `${m.name.padEnd(25)} (${m.filename}) ${isCurrent ? theme.success('[Active]') : ''}`,
      value: m.filename
    };
  });

  const { selectedModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedModel',
      message: 'Select active Whisper model:',
      choices
    }
  ]);

  configManager.setCurrentWhisperModel(selectedModel);
  console.log(theme.success(`✔ Active Whisper model switched to: ${selectedModel}`));
}
