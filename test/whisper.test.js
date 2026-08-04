import test from 'node:test';
import assert from 'node:assert';
import { getAllWhisperModels, getWhisperModelByFilename } from '../src/models/whisper-models.js';

test('Whisper models registry includes recommended small.en-q5_0 model', () => {
  const models = getAllWhisperModels();
  assert.ok(models.length > 0);

  const recommended = models.find(m => m.filename === 'ggml-small.en-q5_0.bin');
  assert.ok(recommended, 'ggml-small.en-q5_0.bin should exist in models registry');
  assert.strictEqual(recommended.recommended, true);
});

test('Whisper model filename lookup', () => {
  const model = getWhisperModelByFilename('ggml-base.bin');
  assert.strictEqual(model.id, 'base');
  assert.strictEqual(model.size, '142 MB');
});
