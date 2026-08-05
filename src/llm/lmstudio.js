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
      // Re-throw so connection failures are not silently reported as success
      // (e.g. by /doctor connectivity checks).
      throw err;
    }
  }

  async streamChat(messages, onToken, stream = true) {
    const url = new URL(`${this.baseUrl}/chat/completions`);
    const payload = JSON.stringify({
      model: this.model,
      messages: messages,
      stream
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

        if (!stream) {
          // Non-streaming response is a single JSON object.
          let body = '';
          res.on('data', (chunk) => { body += chunk.toString(); });
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              const token = (data.choices?.[0]?.message?.content) || '';
              if (onToken) onToken(token);
              resolve(token);
            } catch (err) {
              reject(err);
            }
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

      // Fail instead of hanging indefinitely when the peer stops responding.
      req.setTimeout(30000, () => req.destroy(new Error('LM Studio request timed out')));
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
      req.setTimeout(15000, () => req.destroy(new Error('LM Studio request timed out')));
      req.on('error', reject);
    });
  }
}
