import { APP_NAME, APP_VERSION } from '../constants/defaults.js';
import { theme } from '../ui/theme.js';

export async function executeVersion() {
  console.log(`${theme.primary(APP_NAME)} v${APP_VERSION}`);
}
