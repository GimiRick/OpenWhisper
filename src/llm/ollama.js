import http from 'http';
import https from 'https';
import { URL } from 'url';
import { logger } from '../logger/logger.js';

export class OllamaProvider {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.model = config.model || 'llama3';
  }

  async listModels() {
    try {
      const url = `${this.baseUrl}/api/tags`;
      const res = await this.httpGet(url);
      if (res.models && Array.isArray(res.models)) {
        return res.models.map(m => m.name);
      }
      return [];
    } catch (err) {
      logger.warn({ err, baseUrl: this.baseUrl }, 'Failed to fetch Ollama models');
      // Re-throw so connection failures are not silently reported as success
      // (e.g. by /doctor connectivity checks).
      throw err;
    }
  }

  async streamChat(messages, onToken, stream = true) {
    const url = new URL(`${this.baseUrl}/api/chat`);
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
          return reject(new Error(`Ollama responded with status code ${res.statusCode}`));
        }

        if (!stream) {
          // Non-streaming response is a single JSON object.
          let body = '';
          res.on('data', (chunk) => { body += chunk.toString(); });
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              const token = (data.message && data.message.content) || '';
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
          buffer = lines.pop(); // Keep last incomplete line

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                const token = data.message.content;
                fullText += token;
                if (onToken) onToken(token);
              }
            } catch {
              // Ignore malformed JSON line
            }
          }
        });

        res.on('end', () => {
          if (buffer.trim()) {
            try {
              const data = JSON.parse(buffer);
              if (data.message && data.message.content) {
                const token = data.message.content;
                fullText += token;
                if (onToken) onToken(token);
              }
            } catch {
              // ignore
            }
          }
          resolve(fullText);
        });

        res.on('error', reject);
      });

      // Fail instead of hanging indefinitely when the peer stops responding.
      req.setTimeout(30000, () => req.destroy(new Error('Ollama request timed out')));
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
      req.setTimeout(15000, () => req.destroy(new Error('Ollama request timed out')));
      req.on('error', reject);
    });
  }
}
