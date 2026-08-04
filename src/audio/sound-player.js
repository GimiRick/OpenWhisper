import { exec } from 'child_process';
import { logger } from '../logger/logger.js';
import { configManager } from '../config/config-manager.js';

export class SoundPlayer {
  playSound(soundType) {
    if (!configManager.get('audio.soundCues')) return;

    const isWin = process.platform === 'win32';
    const isMac = process.platform === 'darwin';

    logger.info({ soundType }, 'Playing sound cue');

    try {
      if (isWin) {
        let systemSound = '[System.Media.SystemSounds]::Beep.Play()';
        if (soundType === 'start') systemSound = '[System.Media.SystemSounds]::Asterisk.Play()';
        if (soundType === 'stop') systemSound = '[System.Media.SystemSounds]::Hand.Play()';
        if (soundType === 'success') systemSound = '[System.Media.SystemSounds]::Exclamation.Play()';
        if (soundType === 'error') systemSound = '[System.Media.SystemSounds]::Hand.Play()';

        exec(`powershell -c "${systemSound}"`, (err) => {
          if (err) process.stdout.write('\x07');
        });
      } else if (isMac) {
        let soundName = '/System/Library/Sounds/Ping.aiff';
        if (soundType === 'start') soundName = '/System/Library/Sounds/Tink.aiff';
        if (soundType === 'stop') soundName = '/System/Library/Sounds/Pop.aiff';
        if (soundType === 'success') soundName = '/System/Library/Sounds/Glass.aiff';
        if (soundType === 'error') soundName = '/System/Library/Sounds/Basso.aiff';

        exec(`afplay "${soundName}"`, (err) => {
          if (err) process.stdout.write('\x07');
        });
      } else {
        // Linux fallback
        process.stdout.write('\x07');
      }
    } catch {
      process.stdout.write('\x07');
    }
  }

  playStart() { this.playSound('start'); }
  playStop() { this.playSound('stop'); }
  playSuccess() { this.playSound('success'); }
  playError() { this.playSound('error'); }
  playConfigSaved() { this.playSound('configSaved'); }
}

export const soundPlayer = new SoundPlayer();
