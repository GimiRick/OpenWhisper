import { runCLI } from './src/cli/app.js';
import { pathToFileURL } from 'url';

export * from './src/config/config-manager.js';
export * from './src/whisper/whisper-runner.js';
export * from './src/llm/provider-factory.js';
export * from './src/transcription/orchestrator.js';

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runCLI();
}
