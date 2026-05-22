import type { Note, PitchClass } from './lib/pitch.types';

export type NoteCard = {
  id: number;
  word: string;
  note: PitchClass;
  displayNote: Note;
};

export const NOTE_CARDS: NoteCard[] = [
  { id: 1, word: 'miłość', note: 'B', displayNote: 'B4' },
  { id: 2, word: 'radość', note: 'E', displayNote: 'E4' },
  { id: 3, word: 'pokój', note: 'F#', displayNote: 'F#4' },
  { id: 4, word: 'cierpliwość', note: 'G#', displayNote: 'G#4' },
  { id: 5, word: 'uprzejmość', note: 'A', displayNote: 'A4' },
  { id: 6, word: 'dobroć', note: 'B', displayNote: 'B4' },
  { id: 7, word: 'wierność', note: 'A', displayNote: 'A4' },
  { id: 8, word: 'łagodność', note: 'G#', displayNote: 'G#4' },
  { id: 9, word: 'opanowanie', note: 'A', displayNote: 'A4' },
  { id: 10, word: 'nienawiść', note: 'A#', displayNote: 'A#3' },
  { id: 11, word: 'spór', note: 'C#', displayNote: 'C#4' },
];

export const MELODY: PitchClass[] = ['B', 'E', 'F#', 'G#', 'A', 'B', 'A', 'G#', 'A'];

export const SONG = {
  title: 'Sekwencja',
  acceptedNames: ['sekwencja', 'Sekwencja do Ducha Świętego'],
  lyrics: `Przybądź Duchu Święty
Spuść z niebiosów wzięty
Światła Twego strumień
Przyjdź ojcze ubogich
Dawco darów mnogich
Przyjdź światłości sumień
O najmilszy z gości
Słodka serc radości
Słodkie orzeźwienie
W pracy Tyś ochłodą
W skwarze żywą wodą
W płaczu utulenie
Światłości najświętsza
Serc wierzących wnętrza
Poddaj swej potędze
Bez Twojego tchnienia
Cóż jest wśród stworzenia
Jeno cierń i nędze
Obmyj co nieświęte
Oschłym wlej zachętę
Ulecz serca ranę
Nagnij co jest harde
Rozgrzej serca twarde
Prowadź zabłąkane
Daj Twoim wierzącym
W Tobie ufającym
Siedmiorakie dary
Daj zasługę męstwa
Daj wieniec zwycięstwa
Daj szczęście bez miary
Daj zasługę męstwa
Daj wieniec zwycięstwa
Daj szczęście bez miary`,
  invitation: 'Zaśpiewajmy razem z dorosłymi!',
} as const;

export const DETECTION_CONFIG = {
  minClarity: 0.8,
  stabilityMs: 60,
  minFreq: 80,
  maxFreq: 4200,
} as const;
