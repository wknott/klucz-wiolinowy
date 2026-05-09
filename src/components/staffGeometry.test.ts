import { describe, expect, it } from 'vitest';

import { hasSharp, ledgerLinesFor, noteToStaffPosition } from './staffGeometry';

describe('noteToStaffPosition', () => {
  it('places E4 on position 0 (bottom line of treble staff)', () => {
    expect(noteToStaffPosition('E4')).toBe(0);
  });

  it('places F5 on position 8 (top line of treble staff)', () => {
    expect(noteToStaffPosition('F5')).toBe(8);
  });

  it('places C4 on position -2 (middle C, one ledger below)', () => {
    expect(noteToStaffPosition('C4')).toBe(-2);
  });

  it('places C5 on position 5 (third space from bottom)', () => {
    expect(noteToStaffPosition('C5')).toBe(5);
  });

  it('places F#4 on the same position as F4 (accidental does not shift Y)', () => {
    expect(noteToStaffPosition('F#4')).toBe(1);
    expect(noteToStaffPosition('F4')).toBe(1);
  });

  it('places A4 on position 3 (second space from bottom)', () => {
    expect(noteToStaffPosition('A4')).toBe(3);
  });

  it('places A5 on position 10 (first ledger above the staff)', () => {
    expect(noteToStaffPosition('A5')).toBe(10);
  });

  it('handles octave changes at C boundary (B3 → -3, C4 → -2)', () => {
    expect(noteToStaffPosition('B3')).toBe(-3);
    expect(noteToStaffPosition('C4')).toBe(-2);
  });

  it('handles a wide range up to C6', () => {
    expect(noteToStaffPosition('C6')).toBe(12);
  });

  it('throws on malformed note strings', () => {
    expect(() => noteToStaffPosition('H4' as never)).toThrow(/Invalid note/);
    expect(() => noteToStaffPosition('Cb4' as never)).toThrow(/Invalid note/);
  });
});

describe('hasSharp', () => {
  it('returns true for sharp notes', () => {
    expect(hasSharp('F#5')).toBe(true);
    expect(hasSharp('C#4')).toBe(true);
  });

  it('returns false for natural notes', () => {
    expect(hasSharp('F5')).toBe(false);
    expect(hasSharp('C4')).toBe(false);
  });
});

describe('ledgerLinesFor', () => {
  it('returns no ledger lines for notes inside the staff', () => {
    expect(ledgerLinesFor(0)).toEqual([]); // E4
    expect(ledgerLinesFor(4)).toEqual([]); // B4
    expect(ledgerLinesFor(8)).toEqual([]); // F5
  });

  it('returns one ledger below for C4 (-2)', () => {
    expect(ledgerLinesFor(-2)).toEqual([-2]);
  });

  it('returns one ledger above for A5 (10)', () => {
    expect(ledgerLinesFor(10)).toEqual([10]);
  });

  it('returns the ledger BELOW the note for B5 (11) — note sits in the space', () => {
    expect(ledgerLinesFor(11)).toEqual([10]);
  });

  it('returns two ledgers above for C6 (12)', () => {
    expect(ledgerLinesFor(12)).toEqual([10, 12]);
  });

  it('returns the ledger ABOVE the note for B3 (-3) — note sits in the space', () => {
    expect(ledgerLinesFor(-3)).toEqual([-2]);
  });

  it('returns two ledgers below for A3 (-4)', () => {
    expect(ledgerLinesFor(-4)).toEqual([-2, -4]);
  });
});
