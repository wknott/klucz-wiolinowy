// Run with: yarn qr:urls
// Override base URL: BASE_URL=https://example.com/path yarn qr:urls
// Output is TSV (id, word, url) — paste into a QR generator or pipe to qrencode.

import { NOTE_CARDS } from '../src/config';

const DEFAULT_BASE_URL = 'https://wknott.github.io/klucz-wiolinowy';
const baseUrl = (process.env.BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');

console.log('id\tword\turl');
for (const card of NOTE_CARDS) {
  const url = `${baseUrl}/#/?n=${String(card.id)}`;
  console.log(`${String(card.id)}\t${card.word}\t${url}`);
}
