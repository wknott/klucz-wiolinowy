import { pitchClassOf } from './pitch';
import type { DetectionResult, Note, PitchClass } from './pitch.types';

export type MatcherState = {
  progress: number;
  currentDetectedClass: PitchClass | null;
  stableSince: number | null;
  completed: boolean;
};

export type MatcherEvent =
  | { type: 'detection'; result: DetectionResult; now: number }
  | { type: 'reset' };

export type MatcherTransition = {
  nextState: MatcherState;
  noteAdvanced: boolean;
  justCompleted: boolean;
};

export const initialMatcherState: MatcherState = {
  progress: 0,
  currentDetectedClass: null,
  stableSince: null,
  completed: false,
};

const NO_OP = (state: MatcherState): MatcherTransition => ({
  nextState: state,
  noteAdvanced: false,
  justCompleted: false,
});

export function reduceMatcher(
  state: MatcherState,
  event: MatcherEvent,
  melody: Note[],
  stabilityMs: number,
): MatcherTransition {
  if (event.type === 'reset') {
    return {
      nextState: initialMatcherState,
      noteAdvanced: false,
      justCompleted: false,
    };
  }

  // Detection event past completion: state is frozen.
  if (state.completed) {
    return NO_OP(state);
  }

  const { result, now } = event;

  // Silence — clear "currently hearing" so next note starts a fresh stability window.
  if (result === null) {
    if (state.currentDetectedClass === null && state.stableSince === null) {
      return NO_OP(state);
    }
    return NO_OP({
      ...state,
      currentDetectedClass: null,
      stableSince: null,
    });
  }

  const detectedClass = pitchClassOf(result.note);

  // Class changed (or first detection after silence) → start a new stability window.
  if (detectedClass !== state.currentDetectedClass) {
    return NO_OP({
      ...state,
      currentDetectedClass: detectedClass,
      stableSince: now,
    });
  }

  // Same class as before. If stableSince is null we're "post-advance" and waiting for
  // either silence or a class change before counting again. Either way, no progress.
  if (state.stableSince === null) {
    return NO_OP(state);
  }

  if (now - state.stableSince < stabilityMs) {
    return NO_OP(state);
  }

  // Stable, same class, not yet counted — does it match the next expected note?
  const expectedNote = melody[state.progress];
  const expectedClass = pitchClassOf(expectedNote);

  if (detectedClass !== expectedClass) {
    // Stable wrong note — keep listening, don't advance, don't roll back. Mark
    // stableSince=null so we don't re-evaluate this same wrong reading every frame.
    return NO_OP({
      ...state,
      stableSince: null,
    });
  }

  const newProgress = state.progress + 1;
  const completed = newProgress === melody.length;

  return {
    nextState: {
      ...state,
      progress: newProgress,
      // Clear the stability window so holding the same note can't rack up multiple counts.
      stableSince: null,
      completed,
    },
    noteAdvanced: true,
    justCompleted: completed,
  };
}
