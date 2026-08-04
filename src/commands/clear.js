import fs from 'fs';
import inquirer from 'inquirer';
import { DEFAULT_PATHS } from '../constants/defaults.js';
import { configManager } from '../config/config-manager.js';
import { theme } from '../ui/theme.js';

export async function executeClear() {
  console.log();
  console.log(theme.error('⚠️  WARNING: EXTREMELY DESTRUCTIVE ACTION ⚠️'));
  console.log(theme.error('Running /clear will permanently purge ALL data created by OpenWhisper.'));
  console.log(theme.warning('The following items will be completely deleted:'));
  console.log(`  • Downloaded Whisper models (${DEFAULT_PATHS.modelsDir})`);
  console.log(`  • Application Cache & Audio Recordings (${DEFAULT_PATHS.cacheDir})`);
  console.log(`  • Activity & Error Logs (${DEFAULT_PATHS.logsDir})`);
  console.log(`  • All LLM Configuration Profiles & API Keys (${DEFAULT_PATHS.configFile})`);
  console.log(`  • Downloaded Binaries & Temporary Assets (${DEFAULT_PATHS.downloadsDir})`);
  console.log();

  const { confirm1 } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm1',
      message: theme.error('Are you ABSOLUTELY sure you want to return OpenWhisper to factory state?'),
      default: false
    }
  ]);

  if (!confirm1) {
    console.log(theme.muted('Clear operation aborted. No files were removed.'));
    return;
  }

  const { confirm2 } = await inquirer.prompt([
    {
      type: 'input',
      name: 'confirm2',
      message: 'Type "RESET" to confirm total deletion:'
    }
  ]);

  if (confirm2 !== 'RESET') {
    console.log(theme.muted('Confirmation text mismatch. Clear operation cancelled.'));
    return;
  }

  console.log(theme.primary('\nPurging all OpenWhisper data...'));

  const targets = [
    DEFAULT_PATHS.modelsDir,
    DEFAULT_PATHS.cacheDir,
    DEFAULT_PATHS.logsDir,
    DEFAULT_PATHS.downloadsDir,
    DEFAULT_PATHS.configDir
  ];

  for (const target of targets) {
    try {
      if (fs.existsSync(target)) {
        fs.rmSync(target, { recursive: true, force: true });
        console.log(theme.muted(`Deleted: ${target}`));
      }
    } catch (err) {
      console.log(theme.error(`Failed to delete ${target}: ${err.message}`));
    }
  }

  // Re-initialize default config to factory state
  configManager.resetToDefaults();
  console.log(theme.success('\n✔ Factory reset complete. OpenWhisper has been restored to factory defaults.\n'));
}
