import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ProgressDots } from '@/components/ProgressDots';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MELODY } from '@/config';
import { useGameState } from '@/lib/useGameState';
import { useMelodyMatcher } from '@/lib/useMelodyMatcher';

const COMPLETE_DELAY_MS = 1500;

export default function Listening() {
  const navigate = useNavigate();
  const { markMelodySolved, setStage } = useGameState();
  const [params] = useSearchParams();
  const debug = params.get('debug') === '1' || import.meta.env.DEV;

  const matcher = useMelodyMatcher(MELODY);
  const { status, progress, total, currentlyHearing, error, start, stop, reset } = matcher;

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On completion: mark game state and navigate to /song-name after a beat.
  useEffect(() => {
    if (status !== 'completed') return;
    markMelodySolved();
    setStage('naming');
    const t = setTimeout(() => {
      navigate('/song-name');
    }, COMPLETE_DELAY_MS);
    return () => {
      clearTimeout(t);
    };
  }, [status, markMelodySolved, setStage, navigate]);

  const errorMessage = useMemo(() => {
    switch (error) {
      case 'permission-denied':
        return {
          title: 'Brak dostępu do mikrofonu',
          description:
            'Włącz mikrofon w ustawieniach przeglądarki dla tej strony, a następnie odśwież i spróbuj ponownie.',
        };
      case 'no-microphone':
        return {
          title: 'Nie znaleziono mikrofonu',
          description: 'Podłącz mikrofon i spróbuj ponownie.',
        };
      case 'not-supported':
        return {
          title: 'Brak wsparcia',
          description: 'Twoja przeglądarka nie wspiera nagrywania dźwięku.',
        };
      case 'unknown':
      default:
        return {
          title: 'Coś poszło nie tak',
          description: 'Spróbuj ponownie albo odśwież stronę.',
        };
    }
  }, [error]);

  if (status === 'requesting') {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <h2 className="text-2xl font-bold">Proszę o dostęp do mikrofonu...</h2>
        <p className="text-muted-foreground">Kliknij „Zezwól", gdy przeglądarka zapyta o dostęp.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex w-full max-w-md flex-col gap-4">
        <Alert variant="destructive">
          <AlertTitle>{errorMessage.title}</AlertTitle>
          <AlertDescription>{errorMessage.description}</AlertDescription>
        </Alert>
        <Button onClick={start} size="lg" className="w-full">
          Spróbuj ponownie
        </Button>
        <Button asChild variant="outline">
          <button type="button" onClick={() => navigate('/solve')}>
            Wróć
          </button>
        </Button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <h2 className="text-4xl font-bold">Brawo!</h2>
        <ProgressDots progress={total} total={total} />
        <p className="text-muted-foreground text-lg">Rozpoznałem całą melodię.</p>
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold">Gotowy?</h2>
        <p className="text-muted-foreground">Kliknij, aby rozpocząć nasłuchiwanie.</p>
        <Button size="lg" className="w-full text-xl" onClick={start}>
          Zacznij słuchać
        </Button>
      </div>
    );
  }

  // listening
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <h2 className="text-3xl font-bold">Słucham...</h2>

      <ProgressDots progress={progress} total={total} className="text-2xl" />

      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-3 py-8">
          {currentlyHearing !== null ? (
            <div className="bg-primary text-primary-foreground flex size-32 items-center justify-center rounded-full text-5xl font-bold">
              {currentlyHearing}
            </div>
          ) : (
            <div className="border-border text-muted-foreground flex size-32 items-center justify-center rounded-full border-2 border-dashed text-3xl">
              ...
            </div>
          )}
          <p className="text-muted-foreground text-sm">
            {progress} z {total}
          </p>
        </CardContent>
      </Card>

      <div className="flex w-full gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => {
            reset();
          }}
        >
          Zacznij od nowa
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            stop();
            navigate('/solve');
          }}
        >
          Anuluj
        </Button>
      </div>

      {debug && <DebugPanel matcher={matcher} />}
    </div>
  );
}

type DebugPanelProps = { matcher: ReturnType<typeof useMelodyMatcher> };

function DebugPanel({ matcher }: DebugPanelProps) {
  return (
    <Card className="border-border/60 w-full bg-yellow-50 dark:bg-yellow-950/20">
      <CardContent className="space-y-1 py-4 text-left font-mono text-xs">
        <div>status: {matcher.status}</div>
        <div>
          progress: {matcher.progress} / {matcher.total}
        </div>
        <div>currentlyHearing: {matcher.currentlyHearing ?? '(silence)'}</div>
        <div>error: {matcher.error ?? 'none'}</div>
      </CardContent>
    </Card>
  );
}
