import { Staff } from '@/components/Staff';
import { NOTE_CARDS } from '@/config';
import type { Note } from '@/lib/pitch.types';

const CHROMATIC_C4_TO_C6: Note[] = [
  'C4',
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
  'C5',
  'C#5',
  'D5',
  'D#5',
  'E5',
  'F5',
  'F#5',
  'G5',
  'G#5',
  'A5',
  'A#5',
  'B5',
  'C6',
];

export default function StaffPreview() {
  return (
    <main className="bg-background text-foreground min-h-svh px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold">Podgląd pięciolinii</h1>
        <p className="text-muted-foreground mb-10">
          Wizualna weryfikacja komponentu <code>&lt;Staff /&gt;</code>: nuty z konfiguracji gry oraz
          pełna chromatyka C4–C6.
        </p>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">
            Karteczki z gry ({NOTE_CARDS.length} sztuk)
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {NOTE_CARDS.map((card) => (
              <figure
                key={card.id}
                className="border-border bg-card flex flex-col items-center rounded-lg border p-4"
              >
                <Staff note={card.note} label={card.word} height={180} />
                <figcaption className="text-muted-foreground mt-2 text-xs">
                  id={card.id} · {card.note}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Chromatycznie C4–C6</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {CHROMATIC_C4_TO_C6.map((note) => (
              <figure
                key={note}
                className="border-border bg-card flex flex-col items-center rounded-lg border p-3"
              >
                <Staff note={note} label={note} height={150} />
              </figure>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
