import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { MELODY } from '@/config';

export default function SolveStart() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <h2 className="text-3xl font-bold">Zagadka melodii</h2>
      <p className="text-lg">
        Zagraj na flecie kolejność dźwięków, którą odkryłeś. Aplikacja rozpozna melodię.
      </p>
      <p className="text-xl font-semibold">Melodia ma {MELODY.length} dźwięków</p>
      <Button asChild size="lg" className="w-full text-xl">
        <Link to="/listening">Zacznij grać</Link>
      </Button>
      <p className="text-muted-foreground text-sm">
        Aplikacja poprosi o dostęp do mikrofonu. Graj wyraźnie, jedna nuta na raz.
      </p>
    </div>
  );
}
