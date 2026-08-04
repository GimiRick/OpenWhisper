import path from 'path';
import os from 'os';

export const APP_NAME = 'OpenWhisper';
export const APP_VERSION = '0.0.1';

export const DEFAULT_PATHS = {
  configDir: path.join(os.homedir(), '.openwhisper'),
  configFile: path.join(os.homedir(), '.openwhisper', 'config.json'),
  logsDir: path.join(os.homedir(), '.openwhisper', 'logs'),
  modelsDir: path.join(os.homedir(), '.openwhisper', 'models'),
  cacheDir: path.join(os.homedir(), '.openwhisper', 'cache'),
  downloadsDir: path.join(os.homedir(), '.openwhisper', 'downloads'),
  binDir: path.join(os.homedir(), '.openwhisper', 'bin'),
};

export const DEFAULT_CONFIG = {
  version: APP_VERSION,
  currentWhisperModel: 'ggml-small.en-q5_0.bin',
  currentLLMProfile: 'ollama-default',
  llmProfiles: {
    'ollama-default': {
      id: 'ollama-default',
      name: 'Ollama (Local)',
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
      apiKey: ''
    },
    'lmstudio-default': {
      id: 'lmstudio-default',
      name: 'LM Studio (Local)',
      provider: 'lmstudio',
      baseUrl: 'http://localhost:1234/v1',
      model: 'local-model',
      apiKey: ''
    }
  },
  hotkeys: {
    speechToText: 'CTRL+ALT',
    aiAssistant: 'CTRL+SHIFT+K'
  },
  audio: {
    device: 'default',
    sampleRate: 16000,
    channels: 1,
    soundCues: true
  },
  streaming: true,
  typing: {
    autoPaste: true,
    typingDelayMs: 10,
    useClipboard: true
  },
  preferences: {
    theme: 'dark',
    autoCheckUpdates: true
  }
};

export const WHISPER_MODELS = [
  {
    id: 'tiny',
    name: 'Tiny',
    filename: 'ggml-tiny.bin',
    size: '75 MB',
    vram: '~390 MB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin'
  },
  {
    id: 'tiny.en',
    name: 'Tiny (English)',
    filename: 'ggml-tiny.en.bin',
    size: '75 MB',
    vram: '~390 MB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin'
  },
  {
    id: 'base',
    name: 'Base',
    filename: 'ggml-base.bin',
    size: '142 MB',
    vram: '~500 MB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin'
  },
  {
    id: 'base.en',
    name: 'Base (English)',
    filename: 'ggml-base.en.bin',
    size: '142 MB',
    vram: '~500 MB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin'
  },
  {
    id: 'small',
    name: 'Small',
    filename: 'ggml-small.bin',
    size: '466 MB',
    vram: '~1.0 GB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin'
  },
  {
    id: 'small.en',
    name: 'Small (English)',
    filename: 'ggml-small.en.bin',
    size: '466 MB',
    vram: '~1.0 GB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin'
  },
  {
    id: 'small.en-q5_0',
    name: 'Small English Q5 (Recommended)',
    filename: 'ggml-small.en-q5_0.bin',
    size: '330 MB',
    vram: '~800 MB',
    recommended: true,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en-q5_0.bin'
  },
  {
    id: 'medium',
    name: 'Medium',
    filename: 'ggml-medium.bin',
    size: '1.5 GB',
    vram: '~2.6 GB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin'
  },
  {
    id: 'medium.en',
    name: 'Medium (English)',
    filename: 'ggml-medium.en.bin',
    size: '1.5 GB',
    vram: '~2.6 GB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.en.bin'
  },
  {
    id: 'large-v3',
    name: 'Large v3',
    filename: 'ggml-large-v3.bin',
    size: '3.1 GB',
    vram: '~4.7 GB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin'
  },
  {
    id: 'large-v3-turbo',
    name: 'Large v3 Turbo',
    filename: 'ggml-large-v3-turbo.bin',
    size: '1.6 GB',
    vram: '~2.8 GB',
    recommended: false,
    url: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin'
  }
];
