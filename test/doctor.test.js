import test from 'node:test';
import assert from 'node:assert';
import { dependencyChecker } from '../src/installer/dependency-checker.js';

test('DependencyChecker runs full diagnostic check without throwing', async () => {
  const results = await dependencyChecker.runFullDiagnostics();
  assert.ok(results.microphone);
  assert.ok(results.whisperBinary);
  assert.ok(results.installedModels);
  assert.ok(results.llmConnectivity);
  assert.ok(results.hotkeys);
  assert.ok(results.clipboard);
  assert.ok(results.typingPermissions);
});
