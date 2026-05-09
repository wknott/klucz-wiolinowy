import { useSearchParams } from 'react-router-dom';

export default function App() {
  const [params] = useSearchParams();
  const raw = params.get('n');
  const n = raw && !Number.isNaN(Number(raw)) ? Number(raw) : null;

  return (
    <main className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Klucz wiolinowy</h1>
      <p className="text-muted-foreground">
        {n !== null ? `Parametr n: ${n}` : 'Brak parametru ?n='}
      </p>
    </main>
  );
}
