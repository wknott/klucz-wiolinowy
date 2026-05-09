import { PitchDetector } from 'pitchy';

import { DETECTION_CONFIG } from '../config';
import { freqToNote, isInFluteRange } from './pitch';
import type { DetectionResult } from './pitch.types';

export type PitchStreamHandle = { stop: () => void };

export type PitchStreamErrorReason =
  | 'permission-denied'
  | 'no-microphone'
  | 'not-supported'
  | 'unknown';

const NOOP_HANDLE: PitchStreamHandle = { stop: () => {} };

function classifyMediaError(err: unknown): PitchStreamErrorReason {
  const name =
    typeof err === 'object' && err !== null && 'name' in err
      ? String((err as { name: unknown }).name)
      : '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'permission-denied';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'no-microphone';
  }
  return 'unknown';
}

export async function createPitchStream(
  onResult: (result: DetectionResult) => void,
  onError?: (reason: PitchStreamErrorReason, error: unknown) => void,
): Promise<PitchStreamHandle> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== 'function'
  ) {
    onError?.('not-supported', new Error('navigator.mediaDevices.getUserMedia is not available'));
    return NOOP_HANDLE;
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    onError?.(classifyMediaError(err), err);
    return NOOP_HANDLE;
  }

  // NOTE: AudioContext creation can throw on platforms without Web Audio.
  let audioCtx: AudioContext;
  try {
    audioCtx = new AudioContext();
  } catch (err) {
    stream.getTracks().forEach((t) => t.stop());
    onError?.('not-supported', err);
    return NOOP_HANDLE;
  }

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);

  const detector = PitchDetector.forFloat32Array(analyser.fftSize);
  const buffer = new Float32Array(detector.inputLength);

  let stopped = false;
  let rafId: number | null = null;

  const tick = () => {
    if (stopped) return;
    analyser.getFloatTimeDomainData(buffer);
    const [pitch, clarity] = detector.findPitch(buffer, audioCtx.sampleRate);

    if (clarity < DETECTION_CONFIG.minClarity || !isInFluteRange(pitch)) {
      onResult(null);
    } else {
      const { note, cents } = freqToNote(pitch);
      onResult({ note, cents, clarity });
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      stream.getTracks().forEach((t) => t.stop());
      // close() is async on AudioContext; fire-and-forget is fine here.
      audioCtx.close().catch(() => {
        // ignore — context may already be closed
      });
    },
  };
}
