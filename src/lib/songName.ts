import { SONG } from '@/config';

export function normalizeSongName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/ł/g, 'l') // ł doesn't decompose
    .replace(/[^\p{L}\p{N}\s]/gu, '') // strip punctuation
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
}

export function isSongNameCorrect(input: string): boolean {
  const normalized = normalizeSongName(input);
  if (!normalized) return false;
  return SONG.acceptedNames.map(normalizeSongName).includes(normalized);
}
