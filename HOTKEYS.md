# OpenWhisper Global Hotkeys

OpenWhisper features system-wide keyboard shortcuts that function across all desktop applications.

---

## 1. Direct Speech-to-Text (`CTRL + ALT`)

### Direct Speech Workflow

1. Press `CTRL + ALT` in any application (Word, VS Code, Browser, Slack, Notepad, etc.).
2. Hear the **Start Listening** audio chime (`Tink`/`Asterisk`).
3. Speak your text into the microphone.
4. Press `CTRL + ALT` again to stop recording.
5. Hear the **Stop Listening** chime.
6. OpenWhisper transcribes the audio via Whisper and automatically types/pastes the text at your active cursor position.

---

## 2. AI Assistant Prompt (`CTRL + SHIFT + K`)

### AI Assistant Workflow

1. Press `CTRL + SHIFT + K` anywhere on your computer.
2. Hear the **Start Listening** chime.
3. Dictate your prompt or question (e.g., *"Summarize key differences between REST and GraphQL"*).
4. Press `CTRL + SHIFT + K` again.
5. Whisper transcribes your voice prompt and sends it to your selected LLM (Ollama, LM Studio, or OpenAI Cloud).
6. Live tokens are streamed and auto-typed directly into your focused application window in real time.
