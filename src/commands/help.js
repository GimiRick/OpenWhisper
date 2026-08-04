import { theme } from '../ui/theme.js';
import { renderTable } from '../ui/components.js';
import { hotkeyManager } from '../hotkeys/hotkey-manager.js';

export async function executeHelp() {
  console.log();
  console.log(theme.primary('--- OpenWhisper Slash Commands & Guide ---'));

  const commands = [
    ['/setup whisper', 'Download and select a Whisper speech-to-text model'],
    ['/setup llm config', 'Configure local (Ollama, LM Studio) or Cloud LLMs'],
    ['/switch whisper', 'Switch between installed Whisper models'],
    ['/switch llm config', 'Switch active LLM provider profile'],
    ['/remove llm config', 'Delete an LLM provider configuration'],
    ['/remove whisper', 'Delete an installed Whisper model from disk'],
    ['/models', 'List all available and downloaded Whisper models'],
    ['/status', 'Display system status, paths, active models, and sizes'],
    ['/doctor', 'Run diagnostic health checks (whisper binary, models, LLM, hotkeys, clipboard)'],
    ['/config', 'Display full active configuration in JSON'],
    ['/logs', 'View recent system activity and error logs'],
    ['/version', 'Display OpenWhisper CLI version'],
    ['/help', 'Display command guide and keyboard shortcuts'],
    ['/clear', 'Extremely destructive factory reset (deletes models, cache, logs)'],
    ['/exit', 'Exit OpenWhisper CLI interactive session']
  ];

  renderTable(['Command', 'Description'], commands);

  console.log();
  const keys = hotkeyManager.getEffectiveHotkeys();
  console.log(theme.accent('Terminal Hotkeys (work while this terminal window is focused):'));
  console.log(`  ${theme.key(keys.speechToText.padEnd(12))} Toggle dictation. Whisper transcribes and auto-types into the focused app.`);
  console.log(`  ${theme.key(keys.aiAssistant.padEnd(12))} Toggle AI prompt. Whisper transcribes the prompt, sends it to the LLM, and auto-types the answer.`);
  console.log(`  ${' '.repeat(13)}(Ctrl+${keys.aiAssistant.replace('CTRL+SHIFT+', '')} triggers the same action)`);
  console.log();
}
