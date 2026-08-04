import chalk from 'chalk';

export const theme = {
  primary: chalk.bold.cyan,
  secondary: chalk.magenta,
  accent: chalk.yellow,
  success: chalk.green,
  warning: chalk.hex('#FFA500'),
  error: chalk.bold.red,
  muted: chalk.gray,
  highlight: chalk.bold.white.bgBlue,
  badge: (text) => chalk.black.bgCyan(` ${text} `),
  recommended: (text) => chalk.black.bgYellow(` ⭐ ${text} `),
  command: chalk.bold.yellow,
  key: chalk.bold.white
};
