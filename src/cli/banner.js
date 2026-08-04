import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';
import { APP_NAME, APP_VERSION } from '../constants/defaults.js';
import { configManager } from '../config/config-manager.js';
import { hotkeyManager } from '../hotkeys/hotkey-manager.js';
import { theme } from '../ui/theme.js';

export function renderBanner() {
  console.clear();
  const asciiText = figlet.textSync('OpenWhisper', { font: 'Standard' });
  const coolGradient = gradient(['#00F2FE', '#4FACFE', '#00C6FF']);
  console.log(coolGradient(asciiText));

  const currentWhisper = configManager.getCurrentWhisperModel();
  const currentLLM = configManager.getCurrentLLMProfile();
  const llmName = currentLLM ? `${currentLLM.name} (${currentLLM.model})` : chalk.red('None Configured');
  const streamingStatus = configManager.get('streaming') ? theme.success('Enabled (Token-by-Token)') : theme.muted('Disabled');
  const hotkeys = hotkeyManager.getEffectiveHotkeys();

  console.log(theme.muted('─'.repeat(72)));
  console.log(`${theme.primary('  Version:')}         ${chalk.white(APP_VERSION)}`);
  console.log(`${theme.primary('  Whisper Model:')}   ${theme.accent(currentWhisper)}`);
  console.log(`${theme.primary('  LLM Provider:')}    ${theme.secondary(llmName)}`);
  console.log(`${theme.primary('  Streaming:')}       ${streamingStatus}`);
  console.log(`${theme.primary('  Dictation:')}       ${theme.key(hotkeys.speechToText)} ${theme.muted('(Press to toggle dictation & auto-type)')}`);
  console.log(`${theme.primary('  AI Assistant:')}    ${theme.key(hotkeys.aiAssistant)} ${theme.muted('(Press to dictate a prompt to AI & auto-type)')}`);
  console.log(`${theme.primary('  Status:')}          ${theme.success('● Ready')} ${theme.muted('(Type / for commands)')}`);
  console.log(theme.muted('─'.repeat(72)));
  console.log();
}
