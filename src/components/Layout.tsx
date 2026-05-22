import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
