import type { Note } from './lib/pitch.types';

export type NoteCard = {
  id: number;
  word: string;
  note: Note;
};

export const NOTE_CARDS: NoteCard[] = [
  { id: 1, word: 'miłość', note: 'G5' },
  { id: 2, word: 'radość', note: 'E5' },
  { id: 3, word: 'pokój', note: 'F#5' },
  { id: 4, word: 'cierpliwość', note: 'G#5' },
  { id: 5, word: 'uprzejmość', note: 'A5' },
  { id: 6, word: 'dobroć', note: 'B5' },
  { id: 7, word: 'wierność', note: 'A5' },
  { id: 8, word: 'łagodność', note: 'G#5' },
  { id: 9, word: 'opanowanie', note: 'A5' },
];

export const MELODY: Note[] = ['G5', 'E5', 'F#5', 'G#5', 'A5', 'B5', 'A5', 'G#5', 'A5'];

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
  minClarity: 0.9,
  stabilityMs: 150,
  minFreq: 500,
  maxFreq: 2500,
} as const;
