import test from 'node:test';
import assert from 'node:assert';
import { transcriptionOrchestrator } from '../src/transcription/orchestrator.js';

test('TranscriptionOrchestrator state initialization', () => {
  assert.strictEqual(transcriptionOrchestrator.isSTTRecording, false);
  assert.strictEqual(transcriptionOrchestrator.isAssistantRecording, false);
});
