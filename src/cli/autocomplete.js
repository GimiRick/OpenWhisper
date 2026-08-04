export const COMMAND_REGISTRY = [
  { command: 'setup whisper', description: 'Download and set active Whisper model', aliases: ['setup w', 'setup whisper'] },
  { command: 'setup llm config', description: 'Configure Ollama, LM Studio, or Cloud LLM', aliases: ['setup l', 'setup llm'] },
  { command: 'switch whisper', description: 'Switch between downloaded Whisper models', aliases: ['switch w', 'switch whisper'] },
  { command: 'switch llm config', description: 'Switch active LLM profile', aliases: ['switch l', 'switch llm'] },
  { command: 'remove llm config', description: 'Delete an LLM provider profile', aliases: ['remove l', 'remove llm'] },
  { command: 'remove whisper', description: 'Delete an installed Whisper model', aliases: ['remove w', 'remove whisper'] },
  { command: 'models', description: 'List available and downloaded models', aliases: ['models'] },
  { command: 'status', description: 'View system status, models, & hotkeys', aliases: ['status'] },
  { command: 'config', description: 'Display active configuration JSON', aliases: ['config'] },
  { command: 'doctor', description: 'Run diagnostic health checks', aliases: ['doctor'] },
  { command: 'logs', description: 'View recent system activity logs', aliases: ['logs'] },
  { command: 'version', description: 'Show OpenWhisper version', aliases: ['version'] },
  { command: 'help', description: 'Show command help & shortcuts', aliases: ['help'] },
  { command: 'clear', description: 'Destructive factory reset', aliases: ['clear'] },
  { command: 'exit', description: 'Exit OpenWhisper CLI', aliases: ['exit'] }
];

export function getSuggestions(input) {
  let query = input.trim();
  if (query.startsWith('/')) {
    query = query.slice(1).trim();
  }

  if (!query) {
    return COMMAND_REGISTRY;
  }

  const lower = query.toLowerCase();
  return COMMAND_REGISTRY.filter(cmd => {
    if (cmd.command.toLowerCase().includes(lower)) return true;
    return cmd.aliases.some(a => a.toLowerCase().includes(lower));
  });
}

export function resolveSelectedCommand(input, selectedSuggestion) {
  // CRITICAL REQUIREMENT:
  // If a suggestion is selected (e.g. 'setup whisper'), return the full suggestion command ('setup whisper')
  // regardless of partial input state (e.g. '/setup w').
  if (selectedSuggestion && selectedSuggestion.command) {
    return selectedSuggestion.command;
  }

  let cleaned = input.trim();
  if (cleaned.startsWith('/')) {
    cleaned = cleaned.slice(1).trim();
  }

  // Exact or prefix match fallback
  const matches = getSuggestions(cleaned);
  if (matches.length > 0) {
    return matches[0].command;
  }

  return cleaned;
}
