import ora from 'ora';
import { theme } from './theme.js';

export function createSpinner(text) {
  return ora({
    text: theme.primary(text),
    spinner: 'dots',
    color: 'cyan'
  });
}
