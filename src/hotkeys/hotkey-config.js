import { logger } from '../logger/logger.js';

const DEFAULT_STT_KEY = 't';
const DEFAULT_AI_KEY = 'k';

function extractKeyLetter(hotkeyValue, fallbackLetter) {
  if (!hotkeyValue || typeof hotkeyValue !== 'string') {
    return fallbackLetter;
  }
  const parts = hotkeyValue.split('+').map(p => p.trim().toLowerCase());
  const last = parts[parts.length - 1];
  if (last && /^[a-z]$/.test(last)) {
    return last;
  }
  logger.warn({ hotkeyValue }, 'Configured hotkey cannot be captured in the terminal; falling back to the default');
  return fallbackLetter;
}

export function resolveHotkeyLetters(hotkeys) {
  const config = hotkeys || {};
  let sttKey = extractKeyLetter(config.speechToText, DEFAULT_STT_KEY);
  let aiKey = extractKeyLetter(config.aiAssistant, DEFAULT_AI_KEY);
  if (sttKey === aiKey) {
    logger.warn({ sttKey, aiKey }, 'Speech-to-text and AI Assistant resolve to the same key; remapping AI Assistant');
    aiKey = aiKey === DEFAULT_AI_KEY ? 'l' : DEFAULT_AI_KEY;
  }
  return { sttKey, aiKey };
}

export function formatEffectiveHotkeys(hotkeys) {
  const { sttKey, aiKey } = resolveHotkeyLetters(hotkeys);
  return {
    speechToText: `CTRL+${sttKey.toUpperCase()}`,
    aiAssistant: `CTRL+SHIFT+${aiKey.toUpperCase()}`
  };
}