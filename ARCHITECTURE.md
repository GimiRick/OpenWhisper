# OpenWhisper Architectural Overview

OpenWhisper is designed as a modular, local-first application with clean separation of concerns.

```text
                  +-------------------------+
                  |  OpenWhisper CLI REPL   |
                  +------------+------------+
                               |
                               v
                  +-------------------------+
                  |  ServiceContainer (DI)  |
                  +------------+------------+
                               |
        +----------------------+----------------------+
        |                      |                      |
        v                      v                      v
+---------------+      +---------------+      +---------------+
| AudioRecorder |      | WhisperRunner |      |  LLMFactory   |
+-------+-------+      +-------+-------+      +-------+-------+
        |                      |                      |
        +----------------------+----------------------+
                               |
                               v
               +-------------------------------+
               |  TranscriptionOrchestrator    |
               +---------------+---------------+
                               |
                               v
                  +-------------------------+
                  |      TypingEngine       |
                  |  (Clipboard / Keystroke)|
                  +-------------------------+
```

## Layer Breakdown

- `src/cli/`: REPL engine, Slash autocomplete, ANSI banner, Inquirer prompt integration.
- `src/whisper/`: HuggingFace model downloader with progress tracking and `whisper.cpp` execution runner.
- `src/llm/`: Unified LLM factory supporting Ollama (`/api/chat`), LM Studio (`/v1/chat/completions`), and OpenAI Cloud APIs with SSE token streaming.
- `src/audio/`: Multi-platform WAV audio recorder (`sox`/`powershell`/`arecord`) and audio sound cue player.
- `src/typing/`: High-speed clipboard injection with OS hotkey simulation (`Ctrl+V` / `Cmd+V`) and character fallback.
- `src/config/`: JSON configuration store with secret masking (`ConfigManager`).
- `src/installer/`: System diagnostics engine (`DependencyChecker`).
