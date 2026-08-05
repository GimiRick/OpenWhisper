import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { DEFAULT_PATHS } from '../constants/defaults.js';
import { logger } from '../logger/logger.js';
import { configManager } from '../config/config-manager.js';

export class WhisperRunner {
  constructor() {
    this.binDir = DEFAULT_PATHS.binDir;
    this.modelsDir = DEFAULT_PATHS.modelsDir;
  }

  getBinaryPath() {
    const isWin = process.platform === 'win32';
    const localNames = isWin
      ? ['whisper-cli.exe', 'main.exe', 'whisper.exe']
      : ['whisper-cli', 'main', 'whisper'];
    // Only probe the official whisper.cpp CLI name on the system PATH. Generic
    // names like 'main' or bare 'whisper' are unsafe there (e.g. the OpenAI
    // 'whisper' pip CLI / unrelated binaries would be invoked with whisper.cpp
    // flags and fail confusingly). These names remain valid in local directories.
    const pathNames = isWin ? ['whisper-cli.exe'] : ['whisper-cli'];

    // 1. Check local binDir
    for (const name of localNames) {
      const p = path.join(this.binDir, name);
      if (fs.existsSync(p)) return p;
    }

    // 2. Check current working directory or relative path
    for (const name of localNames) {
      const p = path.join(process.cwd(), 'whisper.cpp', name);
      if (fs.existsSync(p)) return p;
    }

    // 3. System PATH lookup
    const pathDirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
    for (const dir of pathDirs) {
      for (const name of pathNames) {
        const p = path.join(dir, name);
        if (fs.existsSync(p)) return p;
      }
    }

    // 4. Fallback bare name (existence cannot be verified statically)
    return isWin ? 'whisper-cli.exe' : 'whisper-cli';
  }

  isBinaryAvailable() {
    const binPath = this.getBinaryPath();
    if (path.isAbsolute(binPath)) {
      return fs.existsSync(binPath);
    }
    return false;
  }

  async transcribe(audioWavPath, modelFilenameOverride = null) {
    const modelFilename = modelFilenameOverride || configManager.getCurrentWhisperModel();
    const modelPath = path.join(this.modelsDir, modelFilename);

    if (!modelFilename || !fs.existsSync(modelPath) || fs.statSync(modelPath).isDirectory()) {
      if (!this.isBinaryAvailable()) {
        return this.fallbackTranscribe(audioWavPath);
      }
      throw new Error(`Whisper model file not found. Please run /setup whisper to download a model.`);
    }

    const binPath = this.getBinaryPath();
    logger.info({ binPath, modelPath, audioWavPath }, 'Executing Whisper transcription');

    if (!this.isBinaryAvailable()) {
      logger.warn('whisper.cpp binary not found in local path; returning empty transcription');
      return this.fallbackTranscribe(audioWavPath);
    }

    return new Promise((resolve, reject) => {
      const args = [
        '-m', modelPath,
        '-f', audioWavPath,
        '--no-timestamps',
        '-otxt',
        // Write the transcript deterministically next to the audio file so the
        // '<audio>.txt' lookup below is not dependent on the process working
        // directory (whisper.cpp writes to CWD by default).
        '-of', audioWavPath
      ];

      const child = spawn(binPath, args, { stdio: 'pipe' });
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (d) => { stdout += d.toString(); });
      child.stderr.on('data', (d) => { stderr += d.toString(); });

      child.on('close', (code) => {
        if (code === 0 || stdout.trim().length > 0) {
          // Read produced txt file if created, or use stdout
          const txtFile = `${audioWavPath}.txt`;
          if (fs.existsSync(txtFile)) {
            const text = fs.readFileSync(txtFile, 'utf-8').trim();
            fs.unlinkSync(txtFile);
            resolve(text);
          } else {
            const text = stdout.trim();
            resolve(text);
          }
        } else {
          logger.error({ code, stderr }, 'Whisper CLI failed');
          reject(new Error(`Whisper process exited with code ${code}: ${stderr}`));
        }
      });

      child.on('error', (err) => {
        logger.error({ err }, 'Failed to spawn Whisper CLI');
        reject(err);
      });
    });
  }

  async fallbackTranscribe(audioWavPath) {
    logger.warn({ audioWavPath }, 'Whisper binary or model unavailable; returning empty transcription');
    return '';
  }
}

export const whisperRunner = new WhisperRunner();
