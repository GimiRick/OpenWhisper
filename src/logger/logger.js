import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { DEFAULT_PATHS } from '../constants/defaults.js';
import { ensureDirectoriesExist } from '../helpers/paths.js';

ensureDirectoriesExist();

const logFilePath = path.join(DEFAULT_PATHS.logsDir, 'openwhisper.log');

// Create stream to write log file
const fileStream = fs.createWriteStream(logFilePath, { flags: 'a' });

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: ['*.apiKey', 'apiKey', 'authorization', 'headers.authorization', '*.api_key'],
      censor: '***REDACTED***'
    },
    base: { pid: false },
    timestamp: pino.stdTimeFunctions.isoTime
  },
  fileStream
);

export function getLogFilePath() {
  return logFilePath;
}

export function readRecentLogs(lines = 50) {
  if (!fs.existsSync(logFilePath)) return [];
  try {
    const content = fs.readFileSync(logFilePath, 'utf-8');
    const allLines = content.trim().split('\n').filter(Boolean);
    return allLines.slice(-lines);
  } catch (err) {
    logger.error({ err }, 'Failed to read logs file');
    return [];
  }
}
