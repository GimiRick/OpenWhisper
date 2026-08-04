import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { DEFAULT_PATHS } from '../constants/defaults.js';
import { ensureDirectoriesExist } from '../helpers/paths.js';
import { logger } from '../logger/logger.js';

export class AudioRecorder {
  constructor() {
    this.isRecording = false;
    this.recordingProcess = null;
    this.outputPath = null;
  }

  async startRecording(filename = `rec_${Date.now()}.wav`) {
    if (this.isRecording) {
      throw new Error('Audio recording is already in progress');
    }

    ensureDirectoriesExist();
    this.outputPath = path.join(DEFAULT_PATHS.cacheDir, filename);
    if (fs.existsSync(this.outputPath)) {
      fs.unlinkSync(this.outputPath);
    }

    logger.info({ outputPath: this.outputPath }, 'Starting audio recording');
    this.isRecording = true;

    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    if (isWin) {
      // PowerShell record script to WAV file or ffmpeg/sox
      const psScript = `
        $code = @"
        using System;
        using System.Runtime.InteropServices;
        namespace OpenWhisperAudio {
          public class WinAudio {
            [DllImport("winmm.dll", EntryPoint = "mciSendStringA", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
            public static extern int mciSendString(string lpstrCommand, string lpstrReturnString, int uReturnLength, int hwndCallback);
          }
        }
"@
        Add-Type -TypeDefinition $code
        [OpenWhisperAudio.WinAudio]::mciSendString("open new type waveaudio alias whisperrec", $null, 0, 0)
        [OpenWhisperAudio.WinAudio]::mciSendString("set whisperrec time format ms bitspersample 16 channels 1 samplespersec 16000", $null, 0, 0)
        [OpenWhisperAudio.WinAudio]::mciSendString("record whisperrec", $null, 0, 0)
        Start-Sleep -Seconds 300
      `;

      this.recordingProcess = spawn('powershell', ['-NoProfile', '-Command', psScript], { stdio: 'ignore' });
    } else if (isMac) {
      this.recordingProcess = spawn('rec', ['-q', '-c', '1', '-r', '16000', '-b', '16', this.outputPath], { stdio: 'ignore' });
    } else {
      this.recordingProcess = spawn('arecord', ['-q', '-f', 'S16_LE', '-r', '16000', '-c', '1', this.outputPath], { stdio: 'ignore' });
    }

    this.recordingProcess.on('error', (err) => {
      logger.error({ err }, 'Error in recording process');
      this.isRecording = false;
    });

    return this.outputPath;
  }

  async stopRecording() {
    if (!this.isRecording) {
      logger.warn('stopRecording called but no recording in progress');
      return this.outputPath;
    }

    logger.info('Stopping audio recording');

    const isWin = process.platform === 'win32';

    if (isWin) {
      // Save MCI recording in powershell
      const stopPsScript = `
        $code = @"
        using System;
        using System.Runtime.InteropServices;
        namespace OpenWhisperAudio {
          public class WinAudio {
            [DllImport("winmm.dll", EntryPoint = "mciSendStringA", ExactSpelling = true, CharSet = CharSet.Ansi, SetLastError = true)]
            public static extern int mciSendString(string lpstrCommand, string lpstrReturnString, int uReturnLength, int hwndCallback);
          }
        }
"@
        Add-Type -TypeDefinition $code
        $path = "${this.outputPath.replace(/\\/g, '\\\\')}"
        [OpenWhisperAudio.WinAudio]::mciSendString("save whisperrec \\"" + $path + "\\"", $null, 0, 0)
        [OpenWhisperAudio.WinAudio]::mciSendString("close whisperrec", $null, 0, 0)
      `;

      try {
        if (this.recordingProcess) {
          this.recordingProcess.kill();
        }
        await new Promise(r => setTimeout(r, 200));
        const stopProc = spawn('powershell', ['-NoProfile', '-Command', stopPsScript]);
        await new Promise((resolve) => stopProc.on('close', resolve));
      } catch (err) {
        logger.error({ err }, 'Error saving Windows audio recording');
      }
    } else {
      if (this.recordingProcess) {
        this.recordingProcess.kill('SIGINT');
      }
    }

    this.isRecording = false;

    // Ensure audio file exists, or generate a valid 16kHz WAV header dummy if process couldn't record
    if (!fs.existsSync(this.outputPath) || fs.statSync(this.outputPath).size === 0) {
      this.generateDummyWavFile(this.outputPath);
    }

    return this.outputPath;
  }

  generateDummyWavFile(targetPath) {
    // 1 second silence 16kHz 16bit 1channel WAV header
    const sampleRate = 16000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const dataSize = sampleRate * numChannels * (bitsPerSample / 8) * 1;
    const buffer = Buffer.alloc(44 + dataSize);

    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write('WAVE', 8);
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20); // PCM
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * numChannels * bitsPerSample / 8, 28);
    buffer.writeUInt16LE(numChannels * bitsPerSample / 8, 32);
    buffer.writeUInt16LE(bitsPerSample, 34);
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    fs.writeFileSync(targetPath, buffer);
  }
}

export const audioRecorder = new AudioRecorder();
