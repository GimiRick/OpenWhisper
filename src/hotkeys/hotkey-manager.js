import readline from 'readline';
import { transcriptionOrchestrator } from '../transcription/orchestrator.js';
import { logger } from '../logger/logger.js';
import { configManager } from '../config/config-manager.js';

export class HotkeyManager {
  constructor() {
    this.isActive = false;
    this.sttHotkey = configManager.get('hotkeys.speechToText') || 'CTRL+ALT';
    this.aiHotkey = configManager.get('hotkeys.aiAssistant') || 'CTRL+SHIFT+K';
  }

  startListening(onStatusUpdate = null) {
    if (this.isActive) return;
    this.isActive = true;
    logger.info({ sttHotkey: this.sttHotkey, aiHotkey: this.aiHotkey }, 'Global Hotkey Listener initialized');

    // In terminal interactive mode, we also capture keypresses if raw mode available
    if (process.stdin.isTTY) {
      process.stdin.on('keypress', (str, key) => {
        if (!this.isActive) return;

        // Key shortcut matching simulation for terminal sessions
        if (key.ctrl && key.name === 'k') {
          transcriptionOrchestrator.toggleAIAssistant(onStatusUpdate);
        }
      });
    }
  }

  stopListening() {
    this.isActive = false;
    logger.info('Global Hotkey Listener stopped');
  }

  async triggerSTT(onStatusUpdate = null) {
    return transcriptionOrchestrator.toggleSpeechToText(onStatusUpdate);
  }

  async triggerAIAssistant(onStatusUpdate = null, onStreamToken = null) {
    return transcriptionOrchestrator.toggleAIAssistant(onStatusUpdate, onStreamToken);
  }
}

export const hotkeyManager = new HotkeyManager();
