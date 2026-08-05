import clipboardy from 'clipboardy';
import { whisperRunner } from '../whisper/whisper-runner.js';
import { formatEffectiveHotkeys } from '../hotkeys/hotkey-config.js';
import { getInstalledWhisperModels } from '../models/whisper-models.js';
import { configManager } from '../config/config-manager.js';
import { LLMProviderFactory } from '../llm/provider-factory.js';
import { logger } from '../logger/logger.js';

export class DependencyChecker {
  async runFullDiagnostics() {
    const results = {
      microphone: await this.checkMicrophone(),
      whisperBinary: await this.checkWhisperBinary(),
      installedModels: await this.checkWhisperModels(),
      llmConnectivity: await this.checkLLMConnectivity(),
      hotkeys: await this.checkHotkeys(),
      clipboard: await this.checkClipboard(),
      typingPermissions: await this.checkTypingPermissions()
    };

    return results;
  }

  async checkMicrophone() {
    return { ok: false, status: 'unverified', message: 'Not verified. Recording uses the OS default microphone; start a dictation to confirm it works.' };
  }

  async checkWhisperBinary() {
    const isAvail = whisperRunner.isBinaryAvailable();
    const binPath = whisperRunner.getBinaryPath();
    if (isAvail) {
      return { ok: true, message: `whisper.cpp binary ready at ${binPath}` };
    } else {
      return { ok: false, message: `whisper.cpp binary not found (${binPath}). Transcription is unavailable until it is installed.` };
    }
  }

  async checkWhisperModels() {
    const installed = getInstalledWhisperModels();
    const currentModel = configManager.getCurrentWhisperModel();
    const currentInstalled = installed.some(m => m.filename === currentModel);

    if (installed.length === 0) {
      return { ok: false, message: 'No Whisper models downloaded yet. Run /setup whisper to download a model.' };
    }

    if (!currentInstalled) {
      return { ok: false, message: `Active model '${currentModel}' is not downloaded. Run /setup whisper or /switch whisper.` };
    }

    return { ok: true, message: `${installed.length} model(s) installed. Active: ${currentModel}` };
  }

  async checkLLMConnectivity() {
    const profile = configManager.getCurrentLLMProfile();
    if (!profile) {
      return { ok: false, message: 'No LLM profile configured. Run /setup llm config.' };
    }

    const res = await LLMProviderFactory.testConnection(profile);
    if (res.success) {
      return { ok: true, message: `Connected to ${profile.name} (${profile.provider}) - ${res.models.length} model(s) detected` };
    } else {
      return { ok: false, message: `Could not connect to ${profile.name} (${profile.baseUrl}): ${res.error}` };
    }
  }

  async checkHotkeys() {
    const keys = formatEffectiveHotkeys(configManager.get('hotkeys'));
    return { ok: true, message: `Terminal hotkeys active: Dictation ${keys.speechToText}, AI Assistant ${keys.aiAssistant}. Active only while this terminal is focused.` };
  }

  async checkClipboard() {
    let originalClipboard = '';
    try {
      try {
        originalClipboard = await clipboardy.read();
      } catch {
        // Ignore if clipboard is empty or unreadable
      }
      const testString = `openwhisper-check-${Date.now()}`;
      await clipboardy.write(testString);
      const readBack = await clipboardy.read();
      if (readBack === testString) {
        return { ok: true, message: 'Clipboard read/write permissions operational' };
      }
      return { ok: false, message: 'Clipboard test value mismatch' };
    } catch (err) {
      return { ok: false, message: `Clipboard permission error: ${err.message}` };
    } finally {
      // Restore the user's clipboard content that was displaced by the test.
      if (originalClipboard) {
        try {
          await clipboardy.write(originalClipboard);
        } catch {
          // ignore restore errors
        }
      }
    }
  }

  async checkTypingPermissions() {
    return { ok: false, status: 'unverified', message: 'Not verified. Text is injected via clipboard + simulated paste (SendKeys / osascript / xdotool); OS accessibility permission is not pre-checked.' };
  }
}

export const dependencyChecker = new DependencyChecker();
