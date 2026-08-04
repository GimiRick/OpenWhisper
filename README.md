# OpenWhisper

> A local-first AI speech transcription and AI assistant CLI inspired by Claude Code.

Dictate text anywhere on your computer with global hotkeys and stream responses from local (Ollama, LM Studio) or Cloud LLMs directly into your currently focused application.

---

## Key Features

- **Terminal-First Interactive Experience**: Beautiful Claude Code-inspired ASCII banner, live status display, and slash command autocomplete.
- **Global Dictation Hotkey (`CTRL + ALT`)**: Press to start/stop listening. Transcribes speech using whisper.cpp and auto-types into any focused app window without manual pasting.
- **Global AI Assistant Hotkey (`CTRL + SHIFT + K`)**: Press to capture voice prompts, transcribe, send to Ollama / LM Studio / Cloud OpenAI, stream tokens live, and auto-type the response.
- **Whisper Model Management (`/setup whisper`, `/switch whisper`, `/remove whisper`)**: Downloader with progress bar and checksum verification for GGML models (Tiny, Base, Small, Medium, Large, Turbo, and ⭐ **ggml-small.en-q5_0.bin** recommended).
- **Multi-LLM Integration (`/setup llm config`, `/switch llm config`)**: Built-in support for Ollama (`localhost:11434`), LM Studio (`localhost:1234/v1`), and OpenAI-compatible Cloud APIs with real-time SSE token streaming.
- **Diagnostic Health Check (`/doctor`)**: Runs self-tests on microphone, permissions, whisper binaries, installed models, LLM connectivity, global hotkeys, clipboard, and typing drivers.
- **Factory Reset (`/clear`)**: Destructive factory state reset with double confirmation.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run OpenWhisper interactive shell
npm start

# Run non-interactive CLI commands
npx openwhisper doctor
npx openwhisper status
npx openwhisper models
```

---

## Documentation Index

- [Installation Guide](INSTALL.md)
- [Global Hotkeys & Usage](HOTKEYS.md)
- [Configuration Guide](CONFIG.md)
- [Slash Commands Reference](COMMANDS.md)
- [System Architecture](ARCHITECTURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

---

## License

MIT License. Open source and local-first software.
