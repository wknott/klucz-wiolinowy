import { describe, expect, it } from 'vitest';

import {
  initialMatcherState,
  reduceMatcher,
  type MatcherEvent,
  type MatcherState,
  type MatcherTransition,
} from './melodyMatcher';
import type { Note } from './pitch.types';

const STABILITY = 150;

const det = (note: Note, now: number, clarity = 0.95): MatcherEvent => ({
  type: 'detection',
  result: { note, cents: 0, clarity },
  now,
});

const silence = (now: number): MatcherEvent => ({
  type: 'detection',
  result: null,
  now,
});

/**
 * Run a sequence of events through the reducer and return the final transition.
 * Useful for asserting end-state and noteAdvanced/justCompleted on the LAST step.
 */
function run(
  events: MatcherEvent[],
  melody: Note[],
  stabilityMs = STABILITY,
  start: MatcherState = initialMatcherState,
): MatcherTransition {
  let state = start;
  let last: MatcherTransition = {
    nextState: state,
    noteAdvanced: false,
    justCompleted: false,
  };
  for (const e of events) {
    last = reduceMatcher(state, e, melody, stabilityMs);
    state = last.nextState;
  }
  return last;
}

describe('reduceMatcher — reset', () => {
  it('returns initialMatcherState after reset', () => {
    const dirty: MatcherState = {
      progress: 5,
      currentDetectedClass: 'C',
      stableSince: 1234,
      completed: true,
    };
    const t = reduceMatcher(dirty, { type: 'reset' }, ['C5'], STABILITY);
    expect(t.nextState).toEqual(initialMatcherState);
    expect(t.noteAdvanced).toBe(false);
    expect(t.justCompleted).toBe(false);
  });
});

describe('reduceMatcher — silence', () => {
  it('does nothing on null detection at idle', () => {
    const t = reduceMatcher(initialMatcherState, silence(100), ['C5'], STABILITY);
    expect(t.nextState).toEqual(initialMatcherState);
    expect(t.noteAdvanced).toBe(false);
  });

  it('clears currentDetectedClass and stableSince on silence', () => {
    const t = run([det('C5', 0), silence(50)], ['C5']);
    expect(t.nextState.currentDetectedClass).toBeNull();
    expect(t.nextState.stableSince).toBeNull();
    expect(t.nextState.progress).toBe(0);
  });
});

describe('reduceMatcher — first note', () => {
  it('advances progress when correct note is held past stabilityMs', () => {
    const t = run([det('C5', 0), det('C5', STABILITY + 1)], ['C5']);
    expect(t.nextState.progress).toBe(1);
    expect(t.noteAdvanced).toBe(true);
  });

  it('does NOT advance when correct note is detected but unstable', () => {
    const t = run([det('C5', 0), det('C5', STABILITY - 1)], ['C5']);
    expect(t.nextState.progress).toBe(0);
    expect(t.nextState.currentDetectedClass).toBe('C');
    expect(t.nextState.stableSince).toBe(0);
    expect(t.noteAdvanced).toBe(false);
  });

  it('updates currentDetectedClass on a wrong note (no progress)', () => {
    const t = run([det('D5', 0)], ['C5']);
    expect(t.nextState.progress).toBe(0);
    expect(t.nextState.currentDetectedClass).toBe('D');
    expect(t.noteAdvanced).toBe(false);
  });

  it('does not advance on a stable wrong note', () => {
    const t = run([det('D5', 0), det('D5', STABILITY + 1)], ['C5']);
    expect(t.nextState.progress).toBe(0);
    expect(t.noteAdvanced).toBe(false);
  });
});

describe('reduceMatcher — held note vs repeated note', () => {
  it('does not count a held note twice (melody C-C, no silence between)', () => {
    const events = [det('C5', 0), det('C5', 200), det('C5', 400), det('C5', 600)];
    const t = run(events, ['C5', 'C5']);
    expect(t.nextState.progress).toBe(1);
    expect(t.nextState.completed).toBe(false);
  });

  it('counts repeated note when separated by silence (melody C-C)', () => {
    const events = [
      det('C5', 0),
      det('C5', 200), // first C counted at progress=1
      silence(250),
      det('C5', 300),
      det('C5', 500), // second C counted at progress=2
    ];
    const t = run(events, ['C5', 'C5']);
    expect(t.nextState.progress).toBe(2);
    expect(t.nextState.completed).toBe(true);
    expect(t.justCompleted).toBe(true);
  });

  it('also counts repeated note when separated by a different note', () => {
    const events = [
      det('C5', 0),
      det('C5', 200), // C counted
      det('D5', 250), // class change, but D doesn't match expected C
      silence(300),
      det('C5', 350),
      det('C5', 550), // C counted again
    ];
    const t = run(events, ['C5', 'C5']);
    expect(t.nextState.progress).toBe(2);
  });
});

describe('reduceMatcher — octave equivalence', () => {
  it('matches the expected note by pitch class only (C4 satisfies C5)', () => {
    const t = run([det('C4', 0), det('C4', 200)], ['C5']);
    expect(t.nextState.progress).toBe(1);
  });

  it('matches across multiple octaves (F#3 satisfies F#5)', () => {
    const t = run([det('F#3', 0), det('F#3', 200)], ['F#5']);
    expect(t.nextState.progress).toBe(1);
  });
});

describe('reduceMatcher — completion', () => {
  it('sets completed and justCompleted on the last note', () => {
    const events = [
      det('C5', 0),
      det('C5', 200), // 1
      silence(250),
      det('D5', 300),
      det('D5', 500), // 2
      silence(550),
      det('E5', 600),
      det('E5', 800), // 3 → completed
    ];
    const t = run(events, ['C5', 'D5', 'E5']);
    expect(t.nextState.progress).toBe(3);
    expect(t.nextState.completed).toBe(true);
    expect(t.justCompleted).toBe(true);
    expect(t.noteAdvanced).toBe(true);
  });

  it('ignores subsequent detections after completion', () => {
    const completedState: MatcherState = {
      progress: 1,
      currentDetectedClass: null,
      stableSince: null,
      completed: true,
    };
    const t = reduceMatcher(completedState, det('D5', 1000), ['C5'], STABILITY);
    expect(t.nextState).toEqual(completedState);
    expect(t.noteAdvanced).toBe(false);
    expect(t.justCompleted).toBe(false);
  });

  it('justCompleted is only true on the transition step, not after', () => {
    const events = [
      det('C5', 0),
      det('C5', 200), // completes melody
      silence(300),
      det('D5', 400), // no-op (post-completed)
    ];
    const t = run(events, ['C5']);
    expect(t.nextState.completed).toBe(true);
    expect(t.justCompleted).toBe(false);
  });
});
