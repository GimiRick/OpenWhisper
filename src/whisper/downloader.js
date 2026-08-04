import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import ora from 'ora';
import chalk from 'chalk';
import { DEFAULT_PATHS } from '../constants/defaults.js';
import { ensureDirectoriesExist } from '../helpers/paths.js';
import { logger } from '../logger/logger.js';
import { formatBytes } from '../helpers/formatting.js';

export async function downloadWhisperModel(modelObj, onProgress = null) {
  ensureDirectoriesExist();
  const targetPath = path.join(DEFAULT_PATHS.modelsDir, modelObj.filename);
  const tempPath = path.join(DEFAULT_PATHS.downloadsDir, `${modelObj.filename}.tmp`);

  logger.info({ model: modelObj.filename, url: modelObj.url }, 'Starting Whisper model download');

  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(tempPath);
    let downloadedBytes = 0;
    let totalBytes = 0;

    const request = (url) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (response) => {
        // Handle redirects (e.g. HuggingFace 302 redirects)
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          logger.info({ redirectUrl: response.headers.location }, 'Following download redirect');
          return request(response.headers.location);
        }

        if (response.statusCode !== 200) {
          fileStream.close();
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          const err = new Error(`Download failed with status code ${response.statusCode}`);
          logger.error({ err, statusCode: response.statusCode }, 'Whisper model download error');
          return reject(err);
        }

        totalBytes = parseInt(response.headers['content-length'] || '0', 10);

        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          fileStream.write(chunk);
          if (onProgress && totalBytes > 0) {
            const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
            onProgress({ downloadedBytes, totalBytes, percent });
          }
        });

        response.on('end', () => {
          fileStream.end();
          try {
            if (fs.existsSync(targetPath)) {
              fs.unlinkSync(targetPath);
            }
            fs.renameSync(tempPath, targetPath);
            logger.info({ targetPath }, 'Whisper model download completed successfully');
            resolve(targetPath);
          } catch (err) {
            logger.error({ err }, 'Error moving downloaded file');
            reject(err);
          }
        });

        response.on('error', (err) => {
          fileStream.close();
          if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          reject(err);
        });
      }).on('error', (err) => {
        fileStream.close();
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        reject(err);
      });
    };

    request(modelObj.url);
  });
}
