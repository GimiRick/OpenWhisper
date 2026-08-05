import readline from 'readline';
import { transcriptionOrchestrator } from '../transcription/orchestrator.js';
import { logger } from '../logger/logger.js';
import { configManager } from '../config/config-manager.js';
import { resolveHotkeyLetters, formatEffectiveHotkeys } from './hotkey-config.js';

export class HotkeyManager {
  constructor() {
    this.isActive = false;
    this.sttKey = 't';
    this.aiKey = 'k';
  }

  setKeysFromConfig() {
    ({ sttKey: this.sttKey, aiKey: this.aiKey } = resolveHotkeyLetters(configManager.get('hotkeys')));
  }

  getEffectiveHotkeys() {
    return formatEffectiveHotkeys(configManager.get('hotkeys'));
  }

  startListening(onStatusUpdate = null) {
    if (this.isActive) return;
    this.isActive = true;
    this.setKeysFromConfig();
    logger.info({ sttKey: this.sttKey, aiKey: this.aiKey }, 'Terminal Hotkey Listener initialized');

    // Key capture only works while the OpenWhisper terminal window is focused.
    // readline reports Ctrl+<letter> and Ctrl+Shift+<letter> identically, so the
    // AI Assistant responds to both forms.
    if (process.stdin.isTTY) {
      // 'keypress' is not emitted by Node streams on its own: it is synthesized
      // by readline.emitKeypressEvents(), which must be called explicitly.
      // Without it the listener below never fires. The call is idempotent.
      readline.emitKeypressEvents(process.stdin);
      process.stdin.on('keypress', (str, key) => {
        if (!this.isActive) return;
        if (!key || !key.ctrl || !key.name) return;

        if (key.name === this.sttKey) {
          transcriptionOrchestrator.toggleSpeechToText(onStatusUpdate);
        } else if (key.name === this.aiKey) {
          transcriptionOrchestrator.toggleAIAssistant(onStatusUpdate);
        }
      });
    }
  }

  stopListening() {
    this.isActive = false;
    logger.info('Terminal Hotkey Listener stopped');
  }
}

export const hotkeyManager = new HotkeyManager();
