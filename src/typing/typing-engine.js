import clipboardy from 'clipboardy';
import { exec, spawn } from 'child_process';
import { logger } from '../logger/logger.js';
import { configManager } from '../config/config-manager.js';

export class TypingEngine {
  async typeText(text, options = {}) {
    if (!text) return;

    const useClipboard = options.useClipboard ?? configManager.get('typing.useClipboard');
    logger.info({ textLength: text.length, useClipboard }, 'Executing auto-type into focused application');

    if (useClipboard) {
      return this.pasteViaClipboard(text);
    } else {
      return this.typeCharacterByCharacter(text);
    }
  }

  async pasteViaClipboard(text) {
    let originalClipboard = '';
    try {
      originalClipboard = await clipboardy.read();
    } catch {
      // Ignore if clipboard empty or unreadable
    }

    try {
      await clipboardy.write(text);
      await this.simulatePasteHotkey();
      logger.info('Text successfully pasted into focused application');
    } catch (err) {
      logger.error({ err }, 'Failed to paste text via clipboard, attempting direct typing fallback');
      await this.typeCharacterByCharacter(text);
    } finally {
      // Restore original clipboard after brief delay
      setTimeout(async () => {
        try {
          if (originalClipboard) {
            await clipboardy.write(originalClipboard);
          }
        } catch {
          // ignore cleanup errors
        }
      }, 1000);
    }
  }

  async simulatePasteHotkey() {
    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    return new Promise((resolve) => {
      if (isWin) {
        // Send Ctrl+V using PowerShell WScript.Shell
        const psScript = `
          $wsh = New-Object -ComObject WScript.Shell
          $wsh.SendKeys('^v')
        `;
        exec(`powershell -NoProfile -Command "${psScript}"`, () => resolve());
      } else if (isMac) {
        // Send Cmd+V using AppleScript
        const appleScript = 'tell application "System Events" to keystroke "v" using command down';
        exec(`osascript -e '${appleScript}'`, () => resolve());
      } else {
        // Linux using xdotool
        exec('xdotool key ctrl+v', () => resolve());
      }
    });
  }

  async typeCharacterByCharacter(text) {
    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    return new Promise((resolve) => {
      if (isWin) {
        const escaped = text.replace(/'/g, "''").replace(/([+^%~{}()])/g, '{$1}');
        const psScript = `
          $wsh = New-Object -ComObject WScript.Shell
          $wsh.SendKeys('${escaped}')
        `;
        exec(`powershell -NoProfile -Command "${psScript}"`, () => resolve());
      } else if (isMac) {
        const escaped = text.replace(/"/g, '\\"');
        const appleScript = `tell application "System Events" to keystroke "${escaped}"`;
        exec(`osascript -e '${appleScript}'`, () => resolve());
      } else {
        const escaped = text.replace(/"/g, '\\"');
        exec(`xdotool type "${escaped}"`, () => resolve());
      }
    });
  }
}

export const typingEngine = new TypingEngine();
