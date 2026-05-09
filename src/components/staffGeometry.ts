import type { Note } from '@/lib/pitch.types';

const DIATONIC_INDEX: Readonly<Record<string, number>> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

// E4 is the bottom line of the treble staff = position 0.
const E4_DIATONIC = DIATONIC_INDEX.E + 4 * 7;

const STAFF_NOTE_REGEX = /^([A-G])(#?)(-?\d+)$/;

/**
 * Y offset in "half-line-spacings" from the bottom line of the treble staff (E4).
 * Diatonic only — accidentals share a position with the natural (F# = F).
 */
export function noteToStaffPosition(note: Note): number {
  const match = STAFF_NOTE_REGEX.exec(note);
  if (!match) {
    throw new Error(`Invalid note: "${note}"`);
  }
  const letter = match[1];
  const octave = Number.parseInt(match[3], 10);
  const diatonic = DIATONIC_INDEX[letter];
  return diatonic + octave * 7 - E4_DIATONIC;
}

/** True if the note has a sharp accidental. */
export function hasSharp(note: Note): boolean {
  return note.includes('#');
}

/**
 * Positions where ledger lines must be drawn for a note at the given staff position.
 * Returns positions outside the [0..8] staff at every even step up to (and including)
 * the note. Notes inside the staff return [].
 */
export function ledgerLinesFor(position: number): number[] {
  if (position >= 0 && position <= 8) return [];

  const lines: number[] = [];
  if (position > 8) {
    for (let p = 10; p <= position; p += 2) {
      lines.push(p);
    }
  } else {
    for (let p = -2; p >= position; p -= 2) {
      lines.push(p);
    }
  }
  return lines;
}
