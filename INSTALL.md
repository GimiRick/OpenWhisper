# OpenWhisper Installation & Requirements

## Prerequisites

- **Node.js**: v20.0.0 or higher (v22/v24 LTS recommended)
- **Package Manager**: `npm` v9+ or `yarn` / `pnpm`
- **Operating System**: Windows 10/11, macOS 12+, or Linux (Ubuntu/Debian/Arch)

---

## Global CLI Installation

```bash
npm install -g openwhisper
```

After global installation, launch OpenWhisper anywhere:

```bash
openwhisper
```

---

## Local Development Installation

```bash
git clone https://github.com/openwhisper/openwhisper.git
cd OpenWhisper
npm install
npm run cli
```

---

## Native Audio & Hotkey Requirements

### Windows

- No additional tools required. Audio recording uses the built-in PowerShell MCI driver, and auto-typing uses PowerShell `SendKeys`.
- Hotkeys are captured only while the OpenWhisper terminal window is focused; there is no separate system-wide hotkey driver to install.

### macOS

- Install `sox` or `rec` via Homebrew for audio recording:

  ```bash
  brew install sox
  ```

- Grant **Accessibility** and **Microphone** permissions to Terminal / iTerm2 in System Preferences -> Privacy & Security.

### Linux (Ubuntu / Debian)

- Install audio and typing packages:

  ```bash
  sudo apt-get update
  sudo apt-get install sox libsox-fmt-all xdotool
  ```
