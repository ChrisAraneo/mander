import { map, type Observable, pairwise, scan, share } from 'rxjs';
import { computeFrameDelta } from './internal/compute-frame-delta';
import { createEmptyCarry } from './internal/create-empty-carry';
import { nextCarry } from './internal/next-carry';
import { toPulse } from './internal/to-pulse';
import type { AnimationFrame } from './types/animation-frame';
import type { Pulse } from './types/pulse';

export const createFixedPulses = (
  frames: Observable<AnimationFrame>,
): Observable<Pulse> =>
  frames.pipe(
    pairwise(),
    map(computeFrameDelta),
    scan(nextCarry, createEmptyCarry()),
    map(toPulse),
    share(),
  );
