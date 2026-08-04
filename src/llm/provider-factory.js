import { OllamaProvider } from './ollama.js';
import { LMStudioProvider } from './lmstudio.js';
import { CloudOpenAIProvider } from './cloud-openai.js';
import { logger } from '../logger/logger.js';

export class LLMProviderFactory {
  static createProvider(profile) {
    if (!profile) {
      throw new Error('No LLM profile provided to ProviderFactory.');
    }

    const providerType = (profile.provider || '').toLowerCase();

    switch (providerType) {
      case 'ollama':
        return new OllamaProvider(profile);
      case 'lmstudio':
        return new LMStudioProvider(profile);
      case 'cloud':
      case 'openai':
        return new CloudOpenAIProvider(profile);
      default:
        logger.warn({ providerType }, 'Unknown provider type, defaulting to CloudOpenAIProvider');
        return new CloudOpenAIProvider(profile);
    }
  }

  static async testConnection(profile) {
    try {
      const provider = this.createProvider(profile);
      const models = await provider.listModels();
      return { success: true, models };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
