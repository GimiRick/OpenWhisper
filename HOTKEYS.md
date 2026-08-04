# OpenWhisper Hotkeys

OpenWhisper hotkeys are **terminal hotkeys**: they are captured while the OpenWhisper terminal window is focused. They are not system-wide shortcuts — pressing them in another application (Word, VS Code, Browser, etc.) will not reach OpenWhisper.

---

## 1. Direct Speech-to-Text (`CTRL + T`)

### Direct Speech Workflow

1. Make sure the OpenWhisper terminal window is focused.
2. Press `CTRL + T` to start listening.
3. Hear the **Start Listening** audio chime.
4. Speak your text into the microphone.
5. Press `CTRL + T` again to stop recording.
6. Hear the **Stop Listening** chime.
7. OpenWhisper transcribes the audio via Whisper and automatically types/pastes the text at the active cursor position in your focused application.

---

## 2. AI Assistant Prompt (`CTRL + SHIFT + K`)

### AI Assistant Workflow

1. Make sure the OpenWhisper terminal window is focused.
2. Press `CTRL + SHIFT + K` (or `CTRL + K` — the terminal reports both the same way).
3. Hear the **Start Listening** chime.
4. Dictate your prompt or question (e.g., *"Summarize key differences between REST and GraphQL"*).
5. Press the same hotkey again to stop recording.
6. Whisper transcribes your voice prompt and sends it to your selected LLM (Ollama, LM Studio, or OpenAI Cloud).
7. The response is streamed and auto-typed directly into your focused application window.

---

## 3. Configuration

Hotkeys are defined in `~/.openwhisper/config.json` under `hotkeys`:

```json
"hotkeys": {
  "speechToText": "CTRL+T",
  "aiAssistant": "CTRL+SHIFT+K"
}
```

Terminal capture supports `CTRL + <letter>` combinations (e.g. `CTRL+T`, `CTRL+K`).
If a configured combination cannot be captured in the terminal, OpenWhisper logs a
warning and falls back to the default key.

---

## 4. Requirements & Notes

- The **whisper.cpp binary** must be installed and a **Whisper model** downloaded for transcription to work (`/setup whisper`, see [INSTALL.md](INSTALL.md)).
- The **microphone** must be permitted by the operating system (macOS: Privacy & Security → Microphone; Linux: PulseAudio/PipeWire).
- Auto-typing works via clipboard + simulated paste (PowerShell `SendKeys`, AppleScript, or `xdotool`), so the OS must allow synthetic keystrokes. OpenWhisper cannot verify this in advance — start a recording to test it.
- Hotkeys are also captured while a slash-command prompt is open, so pressing them there will start or stop a recording.
