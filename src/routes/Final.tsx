import { Navigate, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SONG } from '@/config';
import { useGameState } from '@/lib/useGameState';

export default function Final() {
  const navigate = useNavigate();
  const { state, reset } = useGameState();

  if (!state.songNamed) {
    return <Navigate to="/" replace />;
  }

  const onReplay = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="text-5xl">🎉</div>
      <h2 className="text-3xl font-bold">{SONG.title}</h2>
      <Card className="w-full">
        <CardContent className="py-6">
          <pre className="text-left font-sans text-base leading-relaxed whitespace-pre-wrap">
            {SONG.lyrics}
          </pre>
        </CardContent>
      </Card>
      <p className="text-xl font-semibold">{SONG.invitation}</p>
      <Button onClick={onReplay} variant="outline" size="lg" className="w-full">
        Zagraj ponownie
      </Button>
    </div>
  );
}
