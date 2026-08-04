import test from 'node:test';
import assert from 'node:assert';
import { TypingEngine } from '../src/typing/typing-engine.js';

test('TypingEngine handles empty input gracefully', async () => {
  const engine = new TypingEngine();
  await engine.typeText('');
  assert.ok(true);
});
