import inquirer from 'inquirer';
import { configManager } from '../config/config-manager.js';
import { theme } from '../ui/theme.js';

export async function executeRemoveLLM() {
  const config = configManager.get();
  const profiles = config.llmProfiles || {};
  const profileKeys = Object.keys(profiles);

  if (profileKeys.length === 0) {
    console.log(theme.warning('\nNo LLM profiles to remove.'));
    return;
  }

  const choices = profileKeys.map(key => {
    const p = profiles[key];
    return {
      name: `${p.name} (${p.provider} - ${p.model})`,
      value: p.id
    };
  });

  const { profileId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'profileId',
      message: 'Select LLM profile to remove:',
      choices
    }
  ]);

  const profileToRemove = profiles[profileId];

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to delete profile '${profileToRemove.name}'?`,
      default: false
    }
  ]);

  if (confirm) {
    configManager.removeLLMProfile(profileId);
    console.log(theme.success(`✔ Removed LLM profile '${profileToRemove.name}'`));
  } else {
    console.log(theme.muted('Operation cancelled.'));
  }
}
