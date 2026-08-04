import { runCLI } from './src/cli/app.js';

export * from './src/config/config-manager.js';
export * from './src/whisper/whisper-runner.js';
export * from './src/llm/provider-factory.js';
export * from './src/transcription/orchestrator.js';

if (import.meta.url === `file://${process.argv[1]}`) {
  runCLI();
}
