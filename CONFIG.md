# OpenWhisper Configuration Guide

All configuration is stored locally in JSON format at:
`~/.openwhisper/config.json`

## Example Configuration Schema

```json
{
  "version": "0.0.1",
  "currentWhisperModel": "ggml-small.en-q5_0.bin",
  "currentLLMProfile": "ollama-default",
  "llmProfiles": {
    "ollama-default": {
      "id": "ollama-default",
      "name": "Ollama (Local)",
      "provider": "ollama",
      "baseUrl": "http://localhost:11434",
      "model": "llama3",
      "apiKey": ""
    },
    "cloud-openai": {
      "id": "cloud-openai",
      "name": "OpenAI GPT-4o Mini",
      "provider": "cloud",
      "baseUrl": "https://api.openai.com/v1",
      "model": "gpt-4o-mini",
      "apiKey": "sk-proj-..."
    }
  },
  "hotkeys": {
    "speechToText": "CTRL+T",
    "aiAssistant": "CTRL+SHIFT+K"
  },
  "audio": {
    "device": "default",
    "sampleRate": 16000,
    "channels": 1,
    "soundCues": true
  },
  "streaming": true,
  "typing": {
    "autoPaste": true,
    "typingDelayMs": 10,
    "useClipboard": true
  }
}
```

## Secret Redaction & Safety

OpenWhisper automatically redacts and masks API keys (`sk-...`) when printing configurations (`/config`) and when writing activity logs to disk.

## Hotkey Notes

Hotkeys are captured only while the OpenWhisper terminal window is focused, and
only `CTRL + <letter>` combinations can be captured (`CTRL+T` for dictation,
`CTRL+K` / `CTRL+SHIFT+K` for the AI Assistant). Unsupported combinations in
`config.json` fall back to the default key with a warning.
