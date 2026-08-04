import inquirer from 'inquirer';
import chalk from 'chalk';
import { getAllWhisperModels, getInstalledWhisperModels } from '../models/whisper-models.js';
import { downloadWhisperModel } from '../whisper/downloader.js';
import { configManager } from '../config/config-manager.js';
import { theme } from '../ui/theme.js';

export async function executeSetupWhisper() {
  console.log();
  console.log(theme.primary('--- Whisper Model Download & Setup ---'));
  
  const allModels = getAllWhisperModels();
  const installedModels = getInstalledWhisperModels();
  const installedFilenames = new Set(installedModels.map(m => m.filename));

  const choices = allModels.map(m => {
    const isInstalled = installedFilenames.has(m.filename);
    const recBadge = m.recommended ? chalk.yellow(' ⭐ Recommended') : '';
    const instBadge = isInstalled ? chalk.green(' [Installed]') : '';
    
    return {
      name: `${m.name.padEnd(28)} (${m.size.padEnd(7)} | VRAM: ${m.vram})${recBadge}${instBadge}`,
      value: m,
      short: m.filename
    };
  });

  const { selectedModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedModel',
      message: 'Select a Whisper model to download and set as active:',
      choices,
      pageSize: 12
    }
  ]);

  if (installedFilenames.has(selectedModel.filename)) {
    console.log(theme.success(`Model ${selectedModel.filename} is already downloaded!`));
    configManager.setCurrentWhisperModel(selectedModel.filename);
    console.log(theme.primary(`Updated active Whisper model to ${selectedModel.filename}`));
    return;
  }

  console.log(theme.primary(`\nDownloading ${selectedModel.filename} (${selectedModel.size})...`));

  let lastPercent = '';
  await downloadWhisperModel(selectedModel, ({ downloadedBytes, totalBytes, percent }) => {
    if (percent !== lastPercent) {
      lastPercent = percent;
      process.stdout.write(`\rDownloading: [${percent}%] (${(downloadedBytes / (1024 * 1024)).toFixed(1)} MB / ${(totalBytes / (1024 * 1024)).toFixed(1)} MB)`);
    }
  });

  console.log('\n');
  console.log(theme.success(`✔ Download completed successfully for ${selectedModel.filename}`));
  configManager.setCurrentWhisperModel(selectedModel.filename);
  console.log(theme.success(`✔ Set active model to: ${selectedModel.filename}`));
}
