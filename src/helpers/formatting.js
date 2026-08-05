export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function maskSecret(secret) {
  if (!secret) return '(Not Set)';
  if (secret.length <= 8) return '********';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
}
