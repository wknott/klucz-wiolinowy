import { describe, expect, it } from 'vitest';

import { isSongNameCorrect, normalizeSongName } from './songName';

describe('normalizeSongName', () => {
  it('lowercases and trims', () => {
    expect(normalizeSongName('  Sekwencja  ')).toBe('sekwencja');
  });

  it('strips Polish diacritics including ł', () => {
    expect(normalizeSongName('Świętą Łąkę żółwią')).toBe('swieta lake zolwia');
  });

  it('strips punctuation but keeps letters and digits', () => {
    expect(normalizeSongName('Sekwencja!!! (do Ducha) Świętego?')).toBe(
      'sekwencja do ducha swietego',
    );
  });

  it('collapses multiple whitespace into single spaces', () => {
    expect(normalizeSongName('Sekwencja    do    Ducha')).toBe('sekwencja do ducha');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(normalizeSongName('   ')).toBe('');
  });

  it('is idempotent', () => {
    const once = normalizeSongName('Świętą Łąkę');
    expect(normalizeSongName(once)).toBe(once);
  });
});

describe('isSongNameCorrect', () => {
  it('accepts the canonical title', () => {
    expect(isSongNameCorrect('Sekwencja')).toBe(true);
  });

  it('accepts "  SEKWENCJA  " (whitespace + casing)', () => {
    expect(isSongNameCorrect('  SEKWENCJA  ')).toBe(true);
  });

  it('accepts the longer name with punctuation', () => {
    expect(isSongNameCorrect('Sekwencja do Ducha Świętego!')).toBe(true);
  });

  it('accepts variants with diacritic differences', () => {
    expect(isSongNameCorrect('sekwencja do ducha swietego')).toBe(true);
  });

  it('rejects unrelated input', () => {
    expect(isSongNameCorrect('Cicha noc')).toBe(false);
  });

  it('rejects glued-together words (no whitespace)', () => {
    expect(isSongNameCorrect('sekwencjadoducha')).toBe(false);
  });

  it('rejects empty input', () => {
    expect(isSongNameCorrect('')).toBe(false);
    expect(isSongNameCorrect('   ')).toBe(false);
  });
});
