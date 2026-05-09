import { MELODY, NOTE_CARDS, SONG, type NoteCard } from '../config';
import { pitchClassOf } from './pitch';
import type { Note, PitchClass } from './pitch.types';

export type ConfigValidationResult = { ok: true } | { ok: false; errors: string[] };

export function normalizeName(s: string): string {
  return s.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
}

export function validateConfig(
  cards: readonly NoteCard[] = NOTE_CARDS,
  melody: readonly Note[] = MELODY,
  acceptedNames: readonly string[] = SONG.acceptedNames,
): ConfigValidationResult {
  const errors: string[] = [];

  const cardClasses = new Set<PitchClass>(cards.map((c) => pitchClassOf(c.note)));

  for (const note of melody) {
    const pc = pitchClassOf(note);
    if (!cardClasses.has(pc)) {
      errors.push(
        `MELODY contains "${note}" (pitch class "${pc}") which is not present in any NOTE_CARD.`,
      );
    }
  }

  if (melody.length < cardClasses.size) {
    errors.push(
      `MELODY length (${melody.length}) must be >= number of unique pitch classes in NOTE_CARDS (${cardClasses.size}).`,
    );
  }

  const seenIds = new Set<number>();
  for (const card of cards) {
    if (seenIds.has(card.id)) {
      errors.push(`NOTE_CARDS has duplicate id: ${card.id}.`);
    }
    seenIds.add(card.id);
  }

  const normalizedNames = acceptedNames.map(normalizeName);
  const seenNames = new Set<string>();
  for (const name of normalizedNames) {
    if (seenNames.has(name)) {
      errors.push(`SONG.acceptedNames has a duplicate after normalization: "${name}".`);
    }
    seenNames.add(name);
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
