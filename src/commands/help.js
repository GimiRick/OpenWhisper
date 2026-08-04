import { theme } from '../ui/theme.js';
import { renderTable } from '../ui/components.js';

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
    ['/doctor', 'Run diagnostic self-tests on microphone, hotkeys, and LLM'],
    ['/config', 'Display full active configuration in JSON'],
    ['/logs', 'View recent system activity and error logs'],
    ['/version', 'Display OpenWhisper CLI version'],
    ['/help', 'Display command guide and keyboard shortcuts'],
    ['/clear', 'Extremely destructive factory reset (deletes models, cache, logs)'],
    ['/exit', 'Exit OpenWhisper CLI interactive session']
  ];

  renderTable(['Command', 'Description'], commands);

  console.log();
  console.log(theme.accent('Keyboard Shortcuts:'));
  console.log(`  ${theme.key('CTRL + ALT')}      Hold/Toggle dictation. Whisper transcribes and auto-types into current app.`);
  console.log(`  ${theme.key('CTRL + SHIFT + K')} Hold/Toggle AI prompt. Whisper transcribes prompt, sends to LLM, and auto-types answer.`);
  console.log();
}
