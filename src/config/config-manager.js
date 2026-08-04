import fs from 'fs';
import path from 'path';
import { DEFAULT_CONFIG, DEFAULT_PATHS } from '../constants/defaults.js';
import { ensureDirectoriesExist } from '../helpers/paths.js';
import { logger } from '../logger/logger.js';
import { maskSecret } from '../helpers/formatting.js';

export class ConfigManager {
  constructor(configFilePath = DEFAULT_PATHS.configFile) {
    this.configFilePath = configFilePath;
    this.config = { ...DEFAULT_CONFIG };
    this.load();
  }

  load() {
    ensureDirectoriesExist();
    try {
      if (fs.existsSync(this.configFilePath)) {
        const rawData = fs.readFileSync(this.configFilePath, 'utf-8');
        const parsed = JSON.parse(rawData);
        this.config = this.mergeDeep({ ...DEFAULT_CONFIG }, parsed);
        logger.info({ configFile: this.configFilePath }, 'Configuration loaded successfully');
      } else {
        this.save();
        logger.info({ configFile: this.configFilePath }, 'Default configuration initialized and saved');
      }
    } catch (error) {
      logger.error({ error, configFile: this.configFilePath }, 'Failed to load configuration, backing up and resetting to default');
      this.config = { ...DEFAULT_CONFIG };
      this.save();
    }
  }

  save() {
    ensureDirectoriesExist();
    try {
      const data = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(this.configFilePath, data, 'utf-8');
      logger.info({ configFile: this.configFilePath }, 'Configuration saved');
    } catch (error) {
      logger.error({ error, configFile: this.configFilePath }, 'Failed to save configuration');
      throw error;
    }
  }

  get(keyPath) {
    if (!keyPath) return this.config;
    const parts = keyPath.split('.');
    let curr = this.config;
    for (const part of parts) {
      if (curr === undefined || curr === null) return undefined;
      curr = curr[part];
    }
    return curr;
  }

  set(keyPath, value) {
    const parts = keyPath.split('.');
    let curr = this.config;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in curr) || typeof curr[part] !== 'object') {
        curr[part] = {};
      }
      curr = curr[part];
    }
    curr[parts[parts.length - 1]] = value;
    this.save();
  }

  getCurrentWhisperModel() {
    return this.config.currentWhisperModel;
  }

  setCurrentWhisperModel(modelFilename) {
    this.config.currentWhisperModel = modelFilename;
    this.save();
  }

  getCurrentLLMProfile() {
    const profileId = this.config.currentLLMProfile;
    return this.config.llmProfiles[profileId] || null;
  }

  setCurrentLLMProfile(profileId) {
    if (!this.config.llmProfiles[profileId]) {
      throw new Error(`LLM Profile '${profileId}' does not exist.`);
    }
    this.config.currentLLMProfile = profileId;
    this.save();
  }

  addLLMProfile(profile) {
    if (!profile.id) {
      profile.id = `profile-${Date.now()}`;
    }
    this.config.llmProfiles[profile.id] = profile;
    this.save();
    return profile.id;
  }

  removeLLMProfile(profileId) {
    if (!this.config.llmProfiles[profileId]) {
      throw new Error(`LLM Profile '${profileId}' does not exist.`);
    }
    delete this.config.llmProfiles[profileId];

    // Reset current if deleted
    if (this.config.currentLLMProfile === profileId) {
      const remainingIds = Object.keys(this.config.llmProfiles);
      this.config.currentLLMProfile = remainingIds.length > 0 ? remainingIds[0] : '';
    }
    this.save();
  }

  getMaskedConfig() {
    const safeConfig = JSON.parse(JSON.stringify(this.config));
    if (safeConfig.llmProfiles) {
      for (const key of Object.keys(safeConfig.llmProfiles)) {
        if (safeConfig.llmProfiles[key].apiKey) {
          safeConfig.llmProfiles[key].apiKey = maskSecret(safeConfig.llmProfiles[key].apiKey);
        }
      }
    }
    return safeConfig;
  }

  resetToDefaults() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.save();
  }

  mergeDeep(target, source) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
        Object.assign(source[key], this.mergeDeep(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
}

export const configManager = new ConfigManager();
