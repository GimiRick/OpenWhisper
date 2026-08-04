import chalk from 'chalk';
import { theme } from './theme.js';

export function renderBox(title, contentLines) {
  const width = 72;
  const topBorder = theme.primary('┌─ ' + title + ' ' + '─'.repeat(Math.max(0, width - title.length - 4)) + '┐');
  const bottomBorder = theme.primary('└' + '─'.repeat(width - 2) + '┘');

  console.log(topBorder);
  for (const line of contentLines) {
    const rawLen = line.replace(/\u001b\[\d+m/g, '').length;
    const padding = ' '.repeat(Math.max(0, width - rawLen - 4));
    console.log(theme.primary('│ ') + line + padding + theme.primary(' │'));
  }
  console.log(bottomBorder);
}

export function renderTable(headers, rows) {
  const colWidths = headers.map((h, i) => {
    const maxRowLen = Math.max(...rows.map(r => (r[i] || '').toString().replace(/\u001b\[\d+m/g, '').length));
    return Math.max(h.length, maxRowLen) + 2;
  });

  const headerStr = headers.map((h, i) => theme.primary(h.padEnd(colWidths[i]))).join('');
  const separatorStr = colWidths.map(w => '─'.repeat(w)).join('');

  console.log(headerStr);
  console.log(theme.muted(separatorStr));

  for (const row of rows) {
    const rowStr = row.map((cell, i) => {
      const str = (cell || '').toString();
      const rawLen = str.replace(/\u001b\[\d+m/g, '').length;
      const padLen = Math.max(0, colWidths[i] - rawLen);
      return str + ' '.repeat(padLen);
    }).join('');
    console.log(rowStr);
  }
}
