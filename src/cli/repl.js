import inquirer from 'inquirer';
import chalk from 'chalk';
import { COMMAND_REGISTRY, resolveSelectedCommand } from './autocomplete.js';
import { executeSetupWhisper } from '../commands/setup-whisper.js';
import { executeSetupLLM } from '../commands/setup-llm.js';
import { executeSwitchWhisper } from '../commands/switch-whisper.js';
import { executeSwitchLLM } from '../commands/switch-llm.js';
import { executeRemoveLLM } from '../commands/remove-llm.js';
import { executeRemoveWhisper } from '../commands/remove-whisper.js';
import { executeModels } from '../commands/models.js';
import { executeStatus } from '../commands/status.js';
import { executeConfig } from '../commands/config.js';
import { executeDoctor } from '../commands/doctor.js';
import { executeLogs } from '../commands/logs.js';
import { executeVersion } from '../commands/version.js';
import { executeHelp } from '../commands/help.js';
import { executeClear } from '../commands/clear.js';
import { executeExit } from '../commands/exit.js';
import { theme } from '../ui/theme.js';
import { renderBanner } from './banner.js';
import { hotkeyManager } from '../hotkeys/hotkey-manager.js';

export async function runREPL() {
  renderBanner();
  hotkeyManager.startListening((msg) => {
    console.log(`\n${theme.badge('HOTKEY EVENT')} ${theme.accent(msg)}`);
  });

  while (true) {
    try {
      const choices = COMMAND_REGISTRY.map(c => ({
        name: `/${c.command.padEnd(22)} - ${chalk.gray(c.description)}`,
        value: c.command
      }));

      const { input } = await inquirer.prompt([
        {
          type: 'list',
          name: 'input',
          message: theme.primary('Select a Slash Command (or press Enter):'),
          choices,
          pageSize: 15
        }
      ]);

      const resolvedCommand = resolveSelectedCommand('', { command: input });
      await dispatchCommand(resolvedCommand);

    } catch (err) {
      if (err.isTtyError || err.name === 'ExitPromptError') {
        await executeExit();
      } else {
        console.log(theme.error(`Command error: ${err.message}`));
      }
    }
  }
}

export async function dispatchCommand(cmdString) {
  let norm = (cmdString || '').toLowerCase().trim();
  if (norm.startsWith('/')) {
    norm = norm.slice(1).trim();
  }

  switch (norm) {
    case 'setup whisper':
      await executeSetupWhisper();
      break;
    case 'setup llm config':
    case 'setup llm':
      await executeSetupLLM();
      break;
    case 'switch whisper':
      await executeSwitchWhisper();
      break;
    case 'switch llm config':
    case 'switch llm':
      await executeSwitchLLM();
      break;
    case 'remove llm config':
    case 'remove llm':
      await executeRemoveLLM();
      break;
    case 'remove whisper':
      await executeRemoveWhisper();
      break;
    case 'models':
      await executeModels();
      break;
    case 'status':
      await executeStatus();
      break;
    case 'config':
      await executeConfig();
      break;
    case 'doctor':
      await executeDoctor();
      break;
    case 'logs':
      await executeLogs();
      break;
    case 'version':
      await executeVersion();
      break;
    case 'help':
      await executeHelp();
      break;
    case 'clear':
      await executeClear();
      break;
    case 'exit':
    case 'quit':
      await executeExit();
      break;
    default:
      console.log(theme.error(`Unknown command: /${cmdString}. Type /help for available commands.`));
  }
}
