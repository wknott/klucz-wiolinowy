import { useCallback, useEffect, useState } from 'react';

import {
  initialGameState,
  loadGameState,
  resetGameState as resetStored,
  saveGameState,
  type GameStage,
  type GameState,
} from './gameState';

export type UseGameStateResult = {
  state: GameState;
  markNoteVisited: (id: number) => void;
  setStage: (stage: GameStage) => void;
  markMelodySolved: () => void;
  markSongNamed: () => void;
  reset: () => void;
};

export function useGameState(): UseGameStateResult {
  const [state, setState] = useState<GameState>(loadGameState);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const markNoteVisited = useCallback((id: number) => {
    setState((prev) =>
      prev.visitedNoteIds.includes(id)
        ? prev
        : { ...prev, visitedNoteIds: [...prev.visitedNoteIds, id] },
    );
  }, []);

  const setStage = useCallback((stage: GameStage) => {
    setState((prev) => (prev.stage === stage ? prev : { ...prev, stage }));
  }, []);

  const markMelodySolved = useCallback(() => {
    setState((prev) => (prev.melodySolved ? prev : { ...prev, melodySolved: true }));
  }, []);

  const markSongNamed = useCallback(() => {
    setState((prev) => (prev.songNamed ? prev : { ...prev, songNamed: true }));
  }, []);

  const reset = useCallback(() => {
    resetStored();
    setState({ ...initialGameState });
  }, []);

  return { state, markNoteVisited, setStage, markMelodySolved, markSongNamed, reset };
}
