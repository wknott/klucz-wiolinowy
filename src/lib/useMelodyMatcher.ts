import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { DETECTION_CONFIG } from '../config';
import { createPitchStream, type PitchStreamErrorReason, type PitchStreamHandle } from './audio';
import {
  initialMatcherState,
  reduceMatcher,
  type MatcherEvent,
  type MatcherState,
} from './melodyMatcher';
import type { Note, PitchClass } from './pitch.types';

export type MatcherStatus = 'idle' | 'requesting' | 'listening' | 'completed' | 'error';

export type UseMelodyMatcherResult = {
  status: MatcherStatus;
  progress: number;
  total: number;
  currentlyHearing: PitchClass | null;
  error: PitchStreamErrorReason | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
};

// NOTE: melody is captured at hook mount time. Subsequent prop changes are
// ignored on purpose — the matcher state machine assumes a fixed target.
export function useMelodyMatcher(melody: Note[]): UseMelodyMatcherResult {
  const melodyRef = useRef<Note[]>(melody);
  const stabilityMsRef = useRef<number>(DETECTION_CONFIG.stabilityMs);

  const [state, dispatch] = useReducer(
    (s: MatcherState, event: MatcherEvent): MatcherState =>
      reduceMatcher(s, event, melodyRef.current, stabilityMsRef.current).nextState,
    initialMatcherState,
  );

  const [status, setStatus] = useState<MatcherStatus>('idle');
  const [error, setError] = useState<PitchStreamErrorReason | null>(null);

  const streamRef = useRef<PitchStreamHandle | null>(null);
  const startInFlightRef = useRef(false);

  const stopInternal = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.stop();
      streamRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    // Idempotent: skip if already running or in the middle of starting.
    if (streamRef.current || startInFlightRef.current) return;

    startInFlightRef.current = true;
    setStatus('requesting');
    setError(null);

    let errored = false;

    void createPitchStream(
      (result) => {
        dispatch({ type: 'detection', result, now: performance.now() });
      },
      (reason) => {
        errored = true;
        setError(reason);
        setStatus('error');
      },
    ).then((handle) => {
      startInFlightRef.current = false;
      if (errored) return;
      streamRef.current = handle;
      setStatus('listening');
    });
  }, []);

  const stop = useCallback(() => {
    stopInternal();
    setStatus((s) => (s === 'completed' || s === 'error' ? s : 'idle'));
  }, [stopInternal]);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  // Auto-stop the stream the moment the matcher reports completion.
  useEffect(() => {
    if (state.completed) {
      stopInternal();
      setStatus('completed');
    }
  }, [state.completed, stopInternal]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopInternal();
    };
  }, [stopInternal]);

  return {
    status,
    progress: state.progress,
    total: melodyRef.current.length,
    currentlyHearing: state.currentDetectedClass,
    error,
    start,
    stop,
    reset,
  };
}
