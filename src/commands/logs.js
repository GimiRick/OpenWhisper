import { getLogFilePath, readRecentLogs } from '../logger/logger.js';
import { theme } from '../ui/theme.js';

export async function executeLogs() {
  const logPath = getLogFilePath();
  console.log();
  console.log(theme.primary(`--- Recent System Logs (${logPath}) ---`));

  const recent = readRecentLogs(30);
  if (recent.length === 0) {
    console.log(theme.muted('No logs available.'));
  } else {
    for (const line of recent) {
      console.log(theme.muted(line));
    }
  }
  console.log();
}
