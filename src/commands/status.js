import { configManager } from '../config/config-manager.js';
import { getInstalledWhisperModels } from '../models/whisper-models.js';
import { getDirectorySize, DEFAULT_PATHS } from '../helpers/paths.js';
import { formatBytes } from '../helpers/formatting.js';
import { renderBox } from '../ui/components.js';
import { theme } from '../ui/theme.js';

export async function executeStatus() {
  const currentWhisper = configManager.getCurrentWhisperModel();
  const currentLLM = configManager.getCurrentLLMProfile();
  const llmDisplay = currentLLM ? `${currentLLM.name} [${currentLLM.provider.toUpperCase()}] (${currentLLM.model})` : theme.error('None');
  const streaming = configManager.get('streaming') ? theme.success('Enabled') : theme.muted('Disabled');
  const hotkeys = configManager.get('hotkeys');

  const cacheSize = formatBytes(getDirectorySize(DEFAULT_PATHS.cacheDir));
  const modelsSize = formatBytes(getDirectorySize(DEFAULT_PATHS.modelsDir));
  const installedCount = getInstalledWhisperModels().length;

  console.log();
  renderBox('OpenWhisper System Status', [
    `${theme.primary('Whisper Model:')}     ${theme.accent(currentWhisper || 'None')}`,
    `${theme.primary('LLM Profile:')}       ${llmDisplay}`,
    `${theme.primary('Streaming Mode:')}    ${streaming}`,
    `${theme.primary('Audio Input:')}       ${configManager.get('audio.device')}`,
    `${theme.primary('Speech Hotkey:')}     ${theme.key(hotkeys.speechToText)}`,
    `${theme.primary('Assistant Hotkey:')}  ${theme.key(hotkeys.aiAssistant)}`,
    `${theme.primary('Cache Directory:')}   ${DEFAULT_PATHS.cacheDir} (${cacheSize})`,
    `${theme.primary('Downloaded Models:')} ${installedCount} model(s) stored (${modelsSize})`,
    `${theme.primary('Config File:')}       ${DEFAULT_PATHS.configFile}`
  ]);
  console.log();
}
