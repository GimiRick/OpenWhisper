import inquirer from 'inquirer';
import { configManager } from '../config/config-manager.js';
import { theme } from '../ui/theme.js';

export async function executeSwitchLLM() {
  const config = configManager.get();
  const profiles = config.llmProfiles || {};
  const profileKeys = Object.keys(profiles);

  if (profileKeys.length === 0) {
    console.log(theme.warning('\nNo LLM profiles configured. Run /setup llm config to add one.'));
    return;
  }

  const currentProfileId = config.currentLLMProfile;

  const choices = profileKeys.map(key => {
    const p = profiles[key];
    const isCurrent = p.id === currentProfileId;
    return {
      name: `${p.name.padEnd(30)} [${p.provider.toUpperCase()}] -> ${p.model} ${isCurrent ? theme.success('[Active]') : ''}`,
      value: p.id
    };
  });

  const { selectedProfileId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedProfileId',
      message: 'Select active LLM profile:',
      choices
    }
  ]);

  configManager.setCurrentLLMProfile(selectedProfileId);
  const activeProfile = configManager.getCurrentLLMProfile();
  console.log(theme.success(`✔ Switched to LLM profile: ${activeProfile.name} (${activeProfile.model})`));
}
