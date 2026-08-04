import test from 'node:test';
import assert from 'node:assert';
import { getSuggestions, resolveSelectedCommand } from '../src/cli/autocomplete.js';

test('Autocomplete suggests all commands when slash is typed', () => {
  const suggestions = getSuggestions('/');
  assert.ok(suggestions.length >= 15);
  assert.ok(suggestions.some(s => s.command === 'setup whisper'));
});

test('Autocomplete filters commands matching query', () => {
  const suggestions = getSuggestions('setup w');
  assert.ok(suggestions.some(s => s.command === 'setup whisper'));
});

test('Selection resolves to full suggestion command, NOT partially typed query', () => {
  const partialTyped = '/setup w';
  const selectedSuggestion = { command: 'setup whisper', description: 'Download and set active Whisper model' };

  const resolved = resolveSelectedCommand(partialTyped, selectedSuggestion);
  assert.strictEqual(resolved, 'setup whisper');
  assert.notStrictEqual(resolved, 'setup w');
});
