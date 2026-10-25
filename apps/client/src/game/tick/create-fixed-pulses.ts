import { FIXED_STEP_MS } from '@mander/model';
import { map, type Observable, pairwise, scan, share } from 'rxjs';
import { nextCarry } from './internal/next-carry';
import type { Carry } from './internal/types/carry';
import type { AnimationFrame } from './types/animation-frame';
import type { Pulse } from './types/pulse';

const createEmptyCarry = (): Carry => ({ carryMs: 0, steps: 0 });

const computeFrameDelta = ([previous, current]: [
  AnimationFrame,
  AnimationFrame,
]): number => current.timestamp - previous.timestamp;

const toPulse = (carry: Carry): Pulse => ({
  steps: carry.steps,
  alpha: carry.carryMs / FIXED_STEP_MS,
});

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
