import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isSongNameCorrect } from '@/lib/songName';
import { useGameState } from '@/lib/useGameState';

const ERROR_AUTO_CLEAR_MS = 3000;

export default function SongName() {
  const navigate = useNavigate();
  const { state, markSongNamed, setStage } = useGameState();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const allowed = state.melodySolved;

  useEffect(() => {
    if (allowed) {
      inputRef.current?.focus();
    }
  }, [allowed]);

  useEffect(() => {
    if (error === null) return;
    const t = setTimeout(() => {
      setError(null);
    }, ERROR_AUTO_CLEAR_MS);
    return () => {
      clearTimeout(t);
    };
  }, [error]);

  if (!allowed) {
    return <Navigate to="/solve" replace />;
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSongNameCorrect(value)) {
      markSongNamed();
      setStage('completed');
      navigate('/final');
      return;
    }
    setError('Spróbuj jeszcze raz');
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md flex-col items-center gap-6">
      <h2 className="text-center text-3xl font-bold">Jaka to pieśń?</h2>
      <p className="text-center text-lg">
        Rozpoznałeś melodię! Wpisz nazwę pieśni, którą zagrałeś.
      </p>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (error !== null) setError(null);
        }}
        placeholder="Nazwa pieśni"
        className="h-14 text-xl"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
      />
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" size="lg" className="w-full text-xl" disabled={value.trim() === ''}>
        Sprawdź
      </Button>
    </form>
  );
}
