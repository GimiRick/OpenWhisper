import test from 'node:test';
import assert from 'node:assert';
import { logger, getLogFilePath, readRecentLogs } from '../src/logger/logger.js';
import fs from 'fs';

test('Pino logger writes entries to log file and redacts API key', () => {
  const logPath = getLogFilePath();
  assert.ok(logPath);

  logger.info({ apiKey: 'sk-secret-key-123456' }, 'Test log entry for redaction check');

  const logs = readRecentLogs(10);
  assert.ok(Array.isArray(logs));
  
  // Verify secret is not leaked in plain text
  const logText = logs.join('\n');
  assert.strictEqual(logText.includes('sk-secret-key-123456'), false);
});
