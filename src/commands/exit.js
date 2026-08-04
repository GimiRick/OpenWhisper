import { theme } from '../ui/theme.js';
import { hotkeyManager } from '../hotkeys/hotkey-manager.js';

export async function executeExit() {
  console.log(theme.primary('\nStopping OpenWhisper services...'));
  hotkeyManager.stopListening();
  console.log(theme.success('Goodbye! OpenWhisper exited cleanly.\n'));
  process.exit(0);
}
