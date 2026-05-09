import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <h2 className="text-3xl font-bold">Nieznana strona</h2>
      <p className="text-muted-foreground text-lg">Strona, której szukasz, nie istnieje.</p>
      <Button asChild size="lg" className="w-full">
        <Link to="/">Wróć na początek</Link>
      </Button>
    </div>
  );
}
