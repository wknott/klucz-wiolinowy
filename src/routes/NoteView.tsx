import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Staff } from '@/components/Staff';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NOTE_CARDS } from '@/config';
import { useGameState } from '@/lib/useGameState';

export default function NoteView() {
  const [params] = useSearchParams();
  const rawN = params.get('n');
  const { state, markNoteVisited } = useGameState();

  const card = useMemo(() => {
    if (rawN === null) return null;
    const n = Number(rawN);
    if (!Number.isInteger(n)) return null;
    return NOTE_CARDS.find((c) => c.id === n) ?? 'invalid';
  }, [rawN]);

  useEffect(() => {
    if (card && card !== 'invalid') {
      markNoteVisited(card.id);
    }
  }, [card, markNoteVisited]);

  // Mode 1: no `n` param at all → landing / continue page.
  if (card === null) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold">Witaj w grze!</h2>
        <p className="text-muted-foreground text-lg">
          Aby zacząć, zeskanuj kod QR z balonu. Każdy balon ma jedno słowo i jedną nutę.
        </p>
        {state.visitedNoteIds.length > 0 && (
          <Button asChild size="lg" className="text-lg">
            <Link to="/solve">Kontynuuj — sprawdź rozwiązanie</Link>
          </Button>
        )}
      </div>
    );
  }

  // Mode 2: `n` present but doesn't match any card.
  if (card === 'invalid') {
    return (
      <div className="flex w-full max-w-md flex-col gap-4">
        <Alert variant="destructive">
          <AlertTitle>Nieznana karteczka</AlertTitle>
          <AlertDescription>
            Ten kod QR nie należy do tej gry. Spróbuj zeskanować inny balon.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/">Wróć na początek</Link>
        </Button>
      </div>
    );
  }

  // Mode 3: valid card.
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
      <h2 className="text-5xl leading-tight font-bold md:text-6xl">{card.word}</h2>
      <Card className="w-full">
        <CardContent className="flex justify-center pt-6">
          <Staff note={card.displayNote} label={card.note} height={240} />
        </CardContent>
      </Card>
      <p className="text-lg">Czy masz już wszystkie nuty? Sprawdź rozwiązanie!</p>
      <Button asChild size="lg" className="w-full text-lg">
        <Link to="/solve">Sprawdź rozwiązanie</Link>
      </Button>
    </div>
  );
}
