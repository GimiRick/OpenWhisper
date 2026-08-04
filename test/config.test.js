import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigManager } from '../src/config/config-manager.js';
import { DEFAULT_CONFIG } from '../src/constants/defaults.js';

test('ConfigManager initialization and defaults', () => {
  const tmpPath = path.join(os.tmpdir(), `openwhisper-test-config-${Date.now()}.json`);
  const cm = new ConfigManager(tmpPath);

  assert.strictEqual(cm.getCurrentWhisperModel(), DEFAULT_CONFIG.currentWhisperModel);
  assert.strictEqual(cm.get('streaming'), true);

  if (fs.existsSync(tmpPath)) {
    fs.unlinkSync(tmpPath);
  }
});

test('ConfigManager profile creation and switching', () => {
  const tmpPath = path.join(os.tmpdir(), `openwhisper-test-config-${Date.now()}.json`);
  const cm = new ConfigManager(tmpPath);

  const newProfile = {
    id: 'test-ollama',
    name: 'Test Ollama',
    provider: 'ollama',
    baseUrl: 'http://localhost:11434',
    model: 'mistral'
  };

  cm.addLLMProfile(newProfile);
  cm.setCurrentLLMProfile('test-ollama');

  const active = cm.getCurrentLLMProfile();
  assert.strictEqual(active.name, 'Test Ollama');
  assert.strictEqual(active.model, 'mistral');

  const masked = cm.getMaskedConfig();
  assert.ok(masked.llmProfiles['test-ollama']);

  if (fs.existsSync(tmpPath)) {
    fs.unlinkSync(tmpPath);
  }
});
