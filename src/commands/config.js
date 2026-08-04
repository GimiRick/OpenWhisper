import { configManager } from '../config/config-manager.js';
import { theme } from '../ui/theme.js';

export async function executeConfig() {
  console.log();
  console.log(theme.primary('--- Current OpenWhisper Configuration ---'));
  const maskedConfig = configManager.getMaskedConfig();
  console.log(theme.muted(JSON.stringify(maskedConfig, null, 2)));
  console.log();
}
