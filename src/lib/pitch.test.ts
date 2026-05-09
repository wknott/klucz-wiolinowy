import { describe, expect, it } from 'vitest';
import { freqToNote, isInFluteRange, notesEqualByClass, pitchClassOf } from './pitch';

describe('freqToNote', () => {
  it('maps 440 Hz to A4 with 0 cents', () => {
    expect(freqToNote(440)).toEqual({ note: 'A4', cents: 0 });
  });

  it('maps 880 Hz to A5 (octave above) with 0 cents', () => {
    expect(freqToNote(880)).toEqual({ note: 'A5', cents: 0 });
  });

  it('maps 261.63 Hz (middle C) to C4 within ±2 cents', () => {
    const result = freqToNote(261.63);
    expect(result.note).toBe('C4');
    expect(Math.abs(result.cents)).toBeLessThanOrEqual(2);
  });

  it('maps 466.16 Hz to A#4 (Bb4) within ±2 cents', () => {
    const result = freqToNote(466.16);
    expect(result.note).toBe('A#4');
    expect(Math.abs(result.cents)).toBeLessThanOrEqual(2);
  });

  it('maps a slightly sharp 445 Hz to A4 with ~+20 cents', () => {
    const result = freqToNote(445);
    expect(result.note).toBe('A4');
    expect(result.cents).toBeGreaterThanOrEqual(15);
    expect(result.cents).toBeLessThanOrEqual(25);
  });

  it('keeps cents within the half-semitone window (-50..+50)', () => {
    for (const freq of [261.63, 440, 445, 466.16, 880]) {
      const { cents } = freqToNote(freq);
      expect(cents).toBeGreaterThanOrEqual(-50);
      expect(cents).toBeLessThanOrEqual(50);
    }
  });
});

describe('pitchClassOf', () => {
  it('returns "C" for "C4"', () => {
    expect(pitchClassOf('C4')).toBe('C');
  });

  it('returns "F#" for "F#5"', () => {
    expect(pitchClassOf('F#5')).toBe('F#');
  });

  it('returns "A#" for "A#3"', () => {
    expect(pitchClassOf('A#3')).toBe('A#');
  });

  it('handles two-digit octave numbers', () => {
    expect(pitchClassOf('C10' as never)).toBe('C');
  });
});

describe('notesEqualByClass', () => {
  it('returns true for same pitch class across octaves', () => {
    expect(notesEqualByClass('C4', 'C5')).toBe(true);
  });

  it('returns false for different pitch classes', () => {
    expect(notesEqualByClass('C4', 'D4')).toBe(false);
  });

  it('treats sharps as their own class', () => {
    expect(notesEqualByClass('F#4', 'F#5')).toBe(true);
    expect(notesEqualByClass('F#4', 'F4')).toBe(false);
  });
});

describe('isInFluteRange', () => {
  it('returns true for a frequency inside 500..2500 Hz', () => {
    expect(isInFluteRange(440)).toBe(false);
    expect(isInFluteRange(500)).toBe(true);
    expect(isInFluteRange(1000)).toBe(true);
    expect(isInFluteRange(2500)).toBe(true);
  });

  it('returns false for frequencies below the soprano-flute range', () => {
    expect(isInFluteRange(100)).toBe(false);
    expect(isInFluteRange(499)).toBe(false);
  });

  it('returns false for frequencies above the soprano-flute range', () => {
    expect(isInFluteRange(2501)).toBe(false);
    expect(isInFluteRange(3000)).toBe(false);
  });
});
