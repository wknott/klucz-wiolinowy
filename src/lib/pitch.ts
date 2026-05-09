import type { Cents, Hz, Note, PitchClass } from './pitch.types';

const PITCH_CLASSES: readonly PitchClass[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

const A4_FREQ_HZ = 440;
const A4_MIDI = 69;
const FLUTE_MIN_HZ = 500;
const FLUTE_MAX_HZ = 2500;

const NOTE_REGEX = /^([A-G]#?)(-?\d+)$/;

export function freqToNote(freq: Hz): { note: Note; cents: Cents } {
  const midi = A4_MIDI + 12 * Math.log2(freq / A4_FREQ_HZ);
  const rounded = Math.round(midi);
  const cents = Math.round((midi - rounded) * 100);

  const pcIndex = ((rounded % 12) + 12) % 12;
  const pitchClass = PITCH_CLASSES[pcIndex];
  const octave = Math.floor(rounded / 12) - 1;

  return { note: `${pitchClass}${octave}` as Note, cents };
}

export function pitchClassOf(note: Note): PitchClass {
  const match = NOTE_REGEX.exec(note);
  if (!match) {
    throw new Error(`Invalid note: "${note}"`);
  }
  return match[1] as PitchClass;
}

export function notesEqualByClass(a: Note, b: Note): boolean {
  return pitchClassOf(a) === pitchClassOf(b);
}

export function isInFluteRange(freq: Hz): boolean {
  return freq >= FLUTE_MIN_HZ && freq <= FLUTE_MAX_HZ;
}
