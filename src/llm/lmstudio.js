import http from 'http';
import https from 'https';
import { URL } from 'url';
import { logger } from '../logger/logger.js';

export class LMStudioProvider {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'http://localhost:1234/v1';
    this.model = config.model || 'local-model';
  }

  async listModels() {
    try {
      const url = `${this.baseUrl}/models`;
      const res = await this.httpGet(url);
      if (res.data && Array.isArray(res.data)) {
        return res.data.map(m => m.id);
      }
      return [];
    } catch (err) {
      logger.warn({ err, baseUrl: this.baseUrl }, 'Failed to fetch LM Studio models');
      return [];
    }
  }

  async streamChat(messages, onToken) {
    const url = new URL(`${this.baseUrl}/chat/completions`);
    const payload = JSON.stringify({
      model: this.model,
      messages: messages,
      stream: true
    });

    return new Promise((resolve, reject) => {
      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`LM Studio responded with status code ${res.statusCode}`));
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
                // Ignore parse errors
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
      const req = client.get(url, (res) => {
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
