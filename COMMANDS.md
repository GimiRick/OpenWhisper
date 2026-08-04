# OpenWhisper Slash Commands Reference

| Command | Usage | Description |
| --- | --- | --- |
| `/setup whisper` | `/setup whisper` | Downloads GGML Whisper models with progress bar & sets active model |
| `/setup llm config` | `/setup llm config` | Interactively configures Ollama, LM Studio, or Cloud OpenAI providers |
| `/switch whisper` | `/switch whisper` | Select active Whisper model from downloaded models |
| `/switch llm config` | `/switch llm config` | Select active LLM provider profile |
| `/remove llm config` | `/remove llm config` | Delete saved LLM profile with confirmation |
| `/remove whisper` | `/remove whisper` | Delete installed Whisper model binary from disk |
| `/models` | `/models` | Display tabular view of available and installed models |
| `/status` | `/status` | Show system overview, directory paths, cache size, & hotkeys |
| `/doctor` | `/doctor` | Diagnostic health check (mic, whisper, llm, hotkeys, clipboard) |
| `/config` | `/config` | Display active configuration JSON with masked secret keys |
| `/logs` | `/logs` | Display recent log entries from `.openwhisper/logs/openwhisper.log` |
| `/version` | `/version` | Output OpenWhisper application version |
| `/help` | `/help` | Display command guide and hotkey instructions |
| `/clear` | `/clear` | Destructive factory reset purge with double confirmation |
| `/exit` | `/exit` | Cleanly exit interactive REPL session |
