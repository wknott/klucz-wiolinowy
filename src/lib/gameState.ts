import { z } from 'zod';

const STORAGE_KEY = 'klucz-wiolinowy:state';

const GameStageSchema = z.enum(['collecting', 'solving', 'naming', 'completed']);

const GameStateSchema = z.object({
  stage: GameStageSchema,
  visitedNoteIds: z.array(z.number().int()),
  melodySolved: z.boolean(),
  songNamed: z.boolean(),
});

export type GameStage = z.infer<typeof GameStageSchema>;
export type GameState = z.infer<typeof GameStateSchema>;

export const initialGameState: GameState = {
  stage: 'collecting',
  visitedNoteIds: [],
  melodySolved: false,
  songNamed: false,
};

// In-memory fallback used when sessionStorage is unavailable (iOS private mode,
// quota exceeded, security exceptions, etc.). Module-scoped so it survives across
// reloads of the same SPA but is wiped on full navigation.
let memoryFallback: GameState | null = null;

function safeGetSessionStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadGameState(): GameState {
  const storage = safeGetSessionStorage();
  if (storage) {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        const result = GameStateSchema.safeParse(parsed);
        if (result.success) return result.data;
      }
    } catch {
      // fall through to fallback / initial
    }
  }
  if (memoryFallback) return memoryFallback;
  return { ...initialGameState };
}

export function saveGameState(state: GameState): void {
  memoryFallback = state;
  const storage = safeGetSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore — quota or security
  }
}

export function resetGameState(): void {
  memoryFallback = null;
  const storage = safeGetSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function markNoteVisited(id: number): void {
  const current = loadGameState();
  if (current.visitedNoteIds.includes(id)) return;
  saveGameState({
    ...current,
    visitedNoteIds: [...current.visitedNoteIds, id],
  });
}
