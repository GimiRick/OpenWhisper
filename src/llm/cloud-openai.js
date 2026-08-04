import http from 'http';
import https from 'https';
import { URL } from 'url';
import { logger } from '../logger/logger.js';

export class CloudOpenAIProvider {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.apiKey = config.apiKey || '';
    this.model = config.model || 'gpt-4o-mini';
  }

  async listModels() {
    try {
      const url = `${this.baseUrl}/models`;
      const res = await this.httpGet(url);
      if (res.data && Array.isArray(res.data)) {
        return res.data.map(m => m.id);
      }
      return [this.model];
    } catch (err) {
      logger.warn({ err, baseUrl: this.baseUrl }, 'Failed to fetch Cloud OpenAI models');
      return [this.model];
    }
  }

  async streamChat(messages, onToken) {
    const cleanBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const endpoint = cleanBase.endsWith('/v1') ? `${cleanBase}/chat/completions` : `${cleanBase}/v1/chat/completions`;
    const url = new URL(endpoint);

    const payload = JSON.stringify({
      model: this.model,
      messages: messages,
      stream: true
    });

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return new Promise((resolve, reject) => {
      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(url, {
        method: 'POST',
        headers
      }, (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', d => errBody += d.toString());
          res.on('end', () => {
            logger.error({ statusCode: res.statusCode, errBody }, 'Cloud OpenAI request error');
            reject(new Error(`Cloud LLM provider error ${res.statusCode}: ${errBody}`));
          });
          return;
        }

        let fullText = '';
        let buffer = '';

        res.on('data', (chunk) => {
          buffer += chunk.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (trimmed.startsWith('data: ')) {
              try {
                const data = JSON.parse(trimmed.slice(6));
                const token = data.choices?.[0]?.delta?.content || '';
                if (token) {
                  fullText += token;
                  if (onToken) onToken(token);
                }
              } catch {
                // Ignore parse error
              }
            }
          }
        });

        res.on('end', () => {
          resolve(fullText);
        });

        res.on('error', reject);
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }

  httpGet(urlString) {
    return new Promise((resolve, reject) => {
      const url = new URL(urlString);
      const client = url.protocol === 'https:' ? https : http;
      const headers = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      const req = client.get(url, { headers }, (res) => {
        let body = '';
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
    });
  }
}
