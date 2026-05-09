import { Outlet } from 'react-router-dom';

// NOTE: high-contrast on purpose — this is a field game, kids holding phones in
// daylight. Dark text on near-white, generous spacing, no dark mode toggle.
export function Layout() {
  const isWide = typeof window !== 'undefined' && window.innerWidth > 1024;

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <header className="border-border/40 border-b py-4 text-center">
        <h1 className="text-xl font-bold tracking-tight">Klucz Wiolinowy</h1>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <Outlet />
      </main>
      {isWide && (
        <footer className="text-muted-foreground border-border/40 border-t py-3 text-center text-xs">
          Aplikacja zaprojektowana dla telefonów. Otwórz na telefonie po zeskanowaniu QR-a.
        </footer>
      )}
    </div>
  );
}
