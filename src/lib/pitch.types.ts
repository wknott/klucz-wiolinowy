export type PitchClass = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type Note = `${PitchClass}${number}`;

export type Hz = number;

export type Cents = number;

export type Clarity = number;

export type DetectionResult = { note: Note; cents: Cents; clarity: Clarity } | null;
