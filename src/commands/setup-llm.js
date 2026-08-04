import inquirer from 'inquirer';
import chalk from 'chalk';
import { configManager } from '../config/config-manager.js';
import { LLMProviderFactory } from '../llm/provider-factory.js';
import { OllamaProvider } from '../llm/ollama.js';
import { LMStudioProvider } from '../llm/lmstudio.js';
import { theme } from '../ui/theme.js';

export async function executeSetupLLM() {
  console.log();
  console.log(theme.primary('--- Setup LLM Provider Configuration ---'));

  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Which LLM provider would you like to configure?',
      choices: [
        { name: 'Ollama (Local LLM Server)', value: 'ollama' },
        { name: 'LM Studio (Local LLM Server)', value: 'lmstudio' },
        { name: 'Cloud (OpenAI / Compatible Cloud API)', value: 'cloud' }
      ]
    }
  ]);

  if (provider === 'ollama') {
    const { baseUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Ollama Base URL:',
        default: 'http://localhost:11434'
      }
    ]);

    const tempProvider = new OllamaProvider({ baseUrl });
    const detectedModels = await tempProvider.listModels();

    let modelName = '';
    if (detectedModels.length > 0) {
      const { model } = await inquirer.prompt([
        {
          type: 'list',
          name: 'model',
          message: 'Select Ollama Model:',
          choices: detectedModels
        }
      ]);
      modelName = model;
    } else {
      const { model } = await inquirer.prompt([
        {
          type: 'input',
          name: 'model',
          message: 'Enter Ollama Model Name:',
          default: 'llama3'
        }
      ]);
      modelName = model;
    }

    const profileId = `ollama-${Date.now()}`;
    const profile = {
      id: profileId,
      name: `Ollama (${modelName})`,
      provider: 'ollama',
      baseUrl,
      model: modelName,
      apiKey: ''
    };

    configManager.addLLMProfile(profile);
    configManager.setCurrentLLMProfile(profileId);
    console.log(theme.success(`✔ Saved and activated Ollama profile: ${profile.name}`));

  } else if (provider === 'lmstudio') {
    const { baseUrl } = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseUrl',
        message: 'LM Studio Base URL:',
        default: 'http://localhost:1234/v1'
      }
    ]);

    const tempProvider = new LMStudioProvider({ baseUrl });
    const detectedModels = await tempProvider.listModels();

    let modelName = '';
    if (detectedModels.length > 0) {
      const { model } = await inquirer.prompt([
        {
          type: 'list',
          name: 'model',
          message: 'Select Loaded LM Studio Model:',
          choices: detectedModels
        }
      ]);
      modelName = model;
    } else {
      const { model } = await inquirer.prompt([
        {
          type: 'input',
          name: 'model',
          message: 'Enter LM Studio Model Identifier:',
          default: 'local-model'
        }
      ]);
      modelName = model;
    }

    const profileId = `lmstudio-${Date.now()}`;
    const profile = {
      id: profileId,
      name: `LM Studio (${modelName})`,
      provider: 'lmstudio',
      baseUrl,
      model: modelName,
      apiKey: ''
    };

    configManager.addLLMProfile(profile);
    configManager.setCurrentLLMProfile(profileId);
    console.log(theme.success(`✔ Saved and activated LM Studio profile: ${profile.name}`));

  } else if (provider === 'cloud') {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Model Label / Display Name:',
        default: 'OpenAI GPT-4o Mini'
      },
      {
        type: 'input',
        name: 'baseUrl',
        message: 'OpenAI-Compatible Base URL:',
        default: 'https://api.openai.com/v1'
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'API Key (Hidden input):',
        mask: '*'
      },
      {
        type: 'input',
        name: 'model',
        message: 'Model Name:',
        default: 'gpt-4o-mini'
      }
    ]);

    const profileId = `cloud-${Date.now()}`;
    const profile = {
      id: profileId,
      name: answers.name,
      provider: 'cloud',
      baseUrl: answers.baseUrl,
      model: answers.model,
      apiKey: answers.apiKey
    };

    configManager.addLLMProfile(profile);
    configManager.setCurrentLLMProfile(profileId);
    console.log(theme.success(`✔ Saved and activated Cloud LLM profile: ${profile.name}`));
  }
}
