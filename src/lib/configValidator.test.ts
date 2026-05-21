import { describe, expect, it } from 'vitest';
import type { PitchClass } from './pitch.types';
import type { NoteCard } from '../config';
import { normalizeName, validateConfig } from './configValidator';

describe('validateConfig (current project config)', () => {
  it('passes for the shipped NOTE_CARDS, MELODY and acceptedNames', () => {
    const result = validateConfig();
    if (!result.ok) {
      throw new Error(`validateConfig failed:\n${result.errors.join('\n')}`);
    }
    expect(result.ok).toBe(true);
  });
});

describe('validateConfig (synthetic fixtures)', () => {
  const cards: NoteCard[] = [
    { id: 1, word: 'a', note: 'C', displayNote: 'C4' },
    { id: 2, word: 'b', note: 'E', displayNote: 'E4' },
    { id: 3, word: 'c', note: 'G', displayNote: 'G4' },
  ];
  const melody: PitchClass[] = ['C', 'E', 'G'];
  const names: string[] = ['cicha noc', 'silent night'];

  it('passes when every melody pitch class exists in cards', () => {
    expect(validateConfig(cards, melody, names).ok).toBe(true);
  });

  it('fails when melody references a pitch class not in cards', () => {
    const badMelody: PitchClass[] = ['C', 'E', 'A'];
    const result = validateConfig(cards, badMelody, names);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('\n')).toMatch(/"A".*not present/);
    }
  });

  it('fails when MELODY is shorter than the number of unique pitch classes in cards', () => {
    const shortMelody: PitchClass[] = ['C', 'E'];
    const result = validateConfig(cards, shortMelody, names);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('\n')).toMatch(/MELODY length \(2\)/);
    }
  });

  it('fails when NOTE_CARDS has duplicate ids', () => {
    const dupCards: NoteCard[] = [
      { id: 1, word: 'a', note: 'C', displayNote: 'C4' },
      { id: 1, word: 'b', note: 'E', displayNote: 'E4' },
      { id: 3, word: 'c', note: 'G', displayNote: 'G4' },
    ];
    const result = validateConfig(dupCards, melody, names);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('\n')).toMatch(/duplicate id: 1/);
    }
  });

  it('fails when acceptedNames collides after normalization', () => {
    const collidingNames = ['Cicha Noc', 'cicha noć']; // both normalize to "cicha noc"
    const result = validateConfig(cards, melody, collidingNames);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('\n')).toMatch(/duplicate after normalization/);
    }
  });
});

describe('normalizeName', () => {
  it('lowercases, trims and strips Polish diacritics', () => {
    expect(normalizeName('  Cicha Noć  ')).toBe('cicha noc');
    expect(normalizeName('Świętą Łąkę żółwią')).toBe('swieta lake zolwia');
  });

  it('is idempotent', () => {
    const once = normalizeName('Cicha Noć');
    expect(normalizeName(once)).toBe(once);
  });
});
