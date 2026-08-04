import { configManager } from '../config/config-manager.js';
import { whisperRunner } from '../whisper/whisper-runner.js';
import { audioRecorder } from '../audio/recorder.js';
import { soundPlayer } from '../audio/sound-player.js';
import { typingEngine } from '../typing/typing-engine.js';
import { dependencyChecker } from '../installer/dependency-checker.js';

class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.register('configManager', configManager);
    this.register('whisperRunner', whisperRunner);
    this.register('audioRecorder', audioRecorder);
    this.register('soundPlayer', soundPlayer);
    this.register('typingEngine', typingEngine);
    this.register('dependencyChecker', dependencyChecker);
  }

  register(name, service) {
    this.services.set(name, service);
  }

  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service '${name}' not registered in ServiceContainer.`);
    }
    return this.services.get(name);
  }
}

export const container = new ServiceContainer();
