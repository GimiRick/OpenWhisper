import test from 'node:test';
import assert from 'node:assert';
import { LLMProviderFactory } from '../src/llm/provider-factory.js';

test('LLMProviderFactory creates Ollama provider', () => {
  const profile = {
    id: 'p1',
    provider: 'ollama',
    baseUrl: 'http://localhost:11434',
    model: 'llama3'
  };

  const provider = LLMProviderFactory.createProvider(profile);
  assert.strictEqual(provider.constructor.name, 'OllamaProvider');
  assert.strictEqual(provider.model, 'llama3');
});

test('LLMProviderFactory creates CloudOpenAI provider', () => {
  const profile = {
    id: 'p2',
    provider: 'cloud',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: 'sk-test-key-123456789',
    model: 'gpt-4o-mini'
  };

  const provider = LLMProviderFactory.createProvider(profile);
  assert.strictEqual(provider.constructor.name, 'CloudOpenAIProvider');
  assert.strictEqual(provider.model, 'gpt-4o-mini');
});
