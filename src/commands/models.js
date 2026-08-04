import { getAllWhisperModels, getInstalledWhisperModels } from '../models/whisper-models.js';
import { renderTable } from '../ui/components.js';
import { theme } from '../ui/theme.js';
import { configManager } from '../config/config-manager.js';

export async function executeModels() {
  console.log();
  console.log(theme.primary('--- Available & Installed Whisper Models ---'));

  const allModels = getAllWhisperModels();
  const installedModels = getInstalledWhisperModels();
  const installedSet = new Set(installedModels.map(m => m.filename));
  const activeModel = configManager.getCurrentWhisperModel();

  const headers = ['Model ID', 'Name', 'File Name', 'Size', 'VRAM', 'Status'];
  const rows = allModels.map(m => {
    const isInstalled = installedSet.has(m.filename);
    const isActive = m.filename === activeModel;

    let status = theme.muted('Not Installed');
    if (isActive) {
      status = theme.success('★ Active');
    } else if (isInstalled) {
      status = theme.accent('✓ Installed');
    }

    return [
      m.id,
      m.recommended ? `${m.name} ⭐` : m.name,
      m.filename,
      m.size,
      m.vram,
      status
    ];
  });

  renderTable(headers, rows);
  console.log();
}
