import { Command } from 'commander';
import { APP_NAME, APP_VERSION } from '../constants/defaults.js';
import { runREPL, dispatchCommand } from './repl.js';
import { executeDoctor } from '../commands/doctor.js';
import { executeStatus } from '../commands/status.js';
import { executeModels } from '../commands/models.js';
import { executeVersion } from '../commands/version.js';
import { executeSetupWhisper } from '../commands/setup-whisper.js';
import { executeSetupLLM } from '../commands/setup-llm.js';
import { executeClear } from '../commands/clear.js';

export function runCLI() {
  const program = new Command();

  program
    .name('openwhisper')
    .description('A local-first AI speech transcription and AI assistant CLI inspired by Claude Code')
    .version(APP_VERSION);

  program
    .command('doctor')
    .description('Run system health and permissions diagnostic')
    .action(async () => {
      await executeDoctor();
    });

  program
    .command('status')
    .description('Display OpenWhisper configuration and directory status')
    .action(async () => {
      await executeStatus();
    });

  program
    .command('models')
    .description('List available and downloaded Whisper models')
    .action(async () => {
      await executeModels();
    });

  program
    .command('setup-whisper')
    .description('Download and configure Whisper models')
    .action(async () => {
      await executeSetupWhisper();
    });

  program
    .command('setup-llm')
    .description('Configure Ollama, LM Studio, or Cloud LLM providers')
    .action(async () => {
      await executeSetupLLM();
    });

  program
    .command('clear')
    .description('Destructive factory reset')
    .action(async () => {
      await executeClear();
    });

  // If arguments provided, parse them; otherwise launch interactive REPL
  if (process.argv.length > 2) {
    program.parse(process.argv);
  } else {
    runREPL();
  }
}
