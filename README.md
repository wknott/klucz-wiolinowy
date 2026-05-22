# Klucz Wiolinowy

Gra terenowa na komunię. Uczestnik znajduje balony z kodami QR (każdy zawiera słowo + jedną nutę), a potem odgrywa odkrytą melodię na flecie sopranowym — aplikacja rozpoznaje dźwięki przez mikrofon i kończy zagadkę odkryciem nazwy pieśni.

**Live:** https://wknott.github.io/klucz-wiolinowy/

## Stack

- React 19 + Vite 6 + TypeScript (strict)
- Tailwind v4 + shadcn/ui (style: `new-york`, base color: `slate`)
- React Router v7 (HashRouter — wymóg statycznego hostingu na GitHub Pages)
- [pitchy](https://github.com/ianprime0509/pitchy) — McLeod Pitch Method (in-browser pitch detection)
- Zod — walidacja stanu z sessionStorage
- Vitest — testy jednostkowe

## Uruchomienie lokalne

```bash
corepack enable
yarn install
yarn dev
```

Otwórz http://localhost:5173/klucz-wiolinowy/

> **Mikrofon na localhost** działa bez HTTPS. Na produkcji wymaga HTTPS — GitHub Pages dostarcza go automatycznie.

## Skrypty

```bash
yarn dev            # dev server (HMR)
yarn build          # produkcyjny build → dist/
yarn preview        # serwowanie dist/ pod http://localhost:4173/klucz-wiolinowy/
yarn typecheck      # tsc --noEmit
yarn test           # vitest watch
yarn test:run       # vitest jednorazowo
yarn test:ui        # vitest UI w przeglądarce
yarn lint           # eslint
yarn format         # prettier --write na całym repo
yarn qr:urls        # generator URLi do QR (TSV: id, word, url)
```

## Modyfikacja treści gry

Cały content gry żyje w jednym pliku: **`src/config.ts`**.

- `NOTE_CARDS` — lista karteczek z balonów (id, słowo, nuta). Każda karteczka = jeden QR.
- `MELODY` — kolejność nut do zagrania (różna od kolejności karteczek; uczestnik odkrywa ją z osobnej zagadki).
- `SONG.title`, `SONG.lyrics`, `SONG.invitation` — finałowa pieśń pokazywana po wpisaniu nazwy.
- `SONG.acceptedNames` — lista wariantów nazwy pieśni akceptowanych przez walidator (case-insensitive, bez diakrytyków, bez interpunkcji).
- `DETECTION_CONFIG` — parametry rozpoznawania dźwięku (próg czystości, czas stabilizacji, zakres częstotliwości).

Po zmianie configu:

1. `yarn test:run` — `configValidator.test.ts` zweryfikuje spójność (wszystkie nuty z melodii pokryte przez karteczki, unikalne `id`, unikalne nazwy po normalizacji).
2. `yarn qr:urls` — wygeneruje nowe URL-e do wydrukowania na balonach.

## Generowanie QR-ów

```bash
yarn qr:urls
```

Output to TSV: `id\tword\turl`. URL-e są względem `BASE_URL` (domyślnie produkcja — `https://wknott.github.io/klucz-wiolinowy`). Aby zmienić bazę:

```bash
BASE_URL=https://example.com/path yarn qr:urls
```

Wynik wklej do dowolnego generatora QR (np. https://wwwqr-code-generator.com) lub zrzuć do pliku PNG przez `qrencode`:

```bash
yarn qr:urls | tail -n +2 | while IFS=$'\t' read -r id word url; do
  qrencode -o "qr-${id}-${word}.png" -s 12 "$url"
done
```

## Deploy

Push na `main` → GitHub Actions (`.github/workflows/deploy.yml`) zrobi `yarn install --immutable && yarn typecheck && yarn build` i wypchnie `dist/` na GitHub Pages przez `actions/deploy-pages@v4`.

W **Settings → Pages** repozytorium musi być wybrane **Source: GitHub Actions**.

Workflow trigger: `push` na `main` + `workflow_dispatch` (ręczne odpalanie z zakładki Actions).

## Routy

| Route                   | Widok        | Co robi                                                                                                                                   |
| ----------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `/?n=1` (i dowolny `n`) | NoteView     | Pokazuje słowo + nutę z karteczki o danym `id`. Bez `n` → ekran powitalny. Nieznane `n` → komunikat błędu.                                |
| `/solve`                | SolveStart   | Instrukcja przed rozpoczęciem nasłuchu. Przycisk „Zacznij grać".                                                                          |
| `/listening`            | Listening    | Aktywny nasłuch mikrofonu. Pokazuje kropki postępu i aktualnie słyszany dźwięk. Po zaliczeniu wszystkich nut → przejście do `/song-name`. |
| `/song-name`            | SongName     | Formularz na nazwę pieśni. Walidacja przez `isSongNameCorrect` (case/diakrytyki/interpunkcja-niewrażliwe). Guard: wymaga `melodySolved`.  |
| `/final`                | Final        | Tytuł, tekst pieśni, zaproszenie do wspólnego śpiewu. Przycisk „Zagraj ponownie" resetuje stan. Guard: wymaga `songNamed`.                |
| `/preview`              | StaffPreview | Narzędzie debug — wszystkie karteczki + chromatyka C4–C6 na pięciolinii.                                                                  |
| `*`                     | NotFound     | 404.                                                                                                                                      |

Stan gry jest persystowany w `sessionStorage` (klucz `klucz-wiolinowy:state`) z fallbackiem do pamięci procesu, gdy storage niedostępny (iOS private mode).

## Tryb debug

Dodaj `?debug=1` do URL-a `/listening` (np. `https://.../#/listening?debug=1`) lub po prostu uruchom dev server (debug włącza się automatycznie pod `import.meta.env.DEV`). Pojawi się dodatkowy panel z surowymi danymi: status matchera, progress, słyszana klasa nuty, ostatni błąd.

## Licencja

Prywatny projekt — gra jednorazowa.
