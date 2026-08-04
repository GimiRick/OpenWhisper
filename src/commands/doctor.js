import { dependencyChecker } from '../installer/dependency-checker.js';
import { theme } from '../ui/theme.js';
import { createSpinner } from '../ui/spinner.js';

export async function executeDoctor() {
  console.log();
  console.log(theme.primary('--- Running OpenWhisper Diagnostics (/doctor) ---'));

  const spinner = createSpinner('Running system checks...');
  spinner.start();

  const diagnostics = await dependencyChecker.runFullDiagnostics();
  spinner.stop();

  const items = [
    { label: 'Microphone Interface', key: 'microphone' },
    { label: 'Whisper.cpp Binary', key: 'whisperBinary' },
    { label: 'Installed Whisper Models', key: 'installedModels' },
    { label: 'LLM Endpoint Connectivity', key: 'llmConnectivity' },
    { label: 'Global Keyboard Hotkeys', key: 'hotkeys' },
    { label: 'Clipboard System Integration', key: 'clipboard' },
    { label: 'Active Window Auto-Typing Driver', key: 'typingPermissions' }
  ];

  for (const item of items) {
    const res = diagnostics[item.key];
    const mark = res.ok ? theme.success('✔ PASS') : theme.error('✖ FAIL');
    console.log(`${mark} ${theme.primary(item.label.padEnd(35))} -> ${res.message}`);
  }

  console.log();
}
