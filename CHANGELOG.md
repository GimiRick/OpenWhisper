# OpenWhisper Changelog

## [0.0.1] - Initial Release

### Added

- Claude Code inspired interactive terminal REPL interface.
- Slash command autocomplete system with VS Code / Claude Code style Enter selection resolution.
- 15 core slash commands (`/setup whisper`, `/setup llm config`, `/switch whisper`, `/switch llm config`, `/remove llm config`, `/remove whisper`, `/models`, `/status`, `/config`, `/doctor`, `/logs`, `/version`, `/help`, `/clear`, `/exit`).
- Whisper model downloader supporting GGML models with progress bar and recommended `ggml-small.en-q5_0.bin`.
- Unified LLM provider system supporting Ollama, LM Studio, and OpenAI-compatible Cloud APIs with real-time SSE token streaming.
- Cross-platform audio recorder and audio feedback sound cues.
- Auto-typing engine with clipboard paste and OS keystroke simulation.
- Comprehensive `/doctor` diagnostic tool suite.
- Destructive `/clear` factory reset.
- Complete unit test suite and extensive documentation.
