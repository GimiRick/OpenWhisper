import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { LLMProviderFactory } from '../src/llm/provider-factory.js';
import { OllamaProvider } from '../src/llm/ollama.js';

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

test('Ollama streamChat non-streaming parses a single JSON response', async () => {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (d) => { body += d.toString(); });
    req.on('end', () => {
      const payload = JSON.parse(body);
      assert.strictEqual(payload.stream, false);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: { role: 'assistant', content: 'Hello there' }, done: true }));
    });
  });
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const provider = new OllamaProvider({ baseUrl: `http://127.0.0.1:${port}`, model: 'test' });
    const tokens = [];
    const result = await provider.streamChat([{ role: 'user', content: 'hi' }], (t) => tokens.push(t), false);
    assert.strictEqual(result, 'Hello there');
    assert.deepStrictEqual(tokens, ['Hello there']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('Ollama streamChat streaming mode emits tokens as they arrive', async () => {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (d) => { body += d.toString(); });
    req.on('end', () => {
      assert.strictEqual(JSON.parse(body).stream, true);
      res.write(JSON.stringify({ message: { role: 'assistant', content: 'Hel' } }) + '\n');
      res.write(JSON.stringify({ message: { role: 'assistant', content: 'lo' } }) + '\n');
      res.end(JSON.stringify({ done: true }));
    });
  });
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const provider = new OllamaProvider({ baseUrl: `http://127.0.0.1:${port}`, model: 'test' });
    const tokens = [];
    const result = await provider.streamChat([{ role: 'user', content: 'hi' }], (t) => tokens.push(t));
    assert.strictEqual(result, 'Hello');
    assert.deepStrictEqual(tokens, ['Hel', 'lo']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('OllamaProvider.listModels rejects when the endpoint is unreachable', async () => {
  const provider = new OllamaProvider({ baseUrl: 'http://127.0.0.1:1', model: 'test' });
  await assert.rejects(provider.listModels());
});

test('LLMProviderFactory.testConnection reports failure, not success', async () => {
  const profile = { id: 'p3', provider: 'ollama', baseUrl: 'http://127.0.0.1:1', model: 'test' };
  const result = await LLMProviderFactory.testConnection(profile);
  // Prior behavior returned { success: true } because listModels swallowed the error.
  assert.strictEqual(result.success, false);
});
