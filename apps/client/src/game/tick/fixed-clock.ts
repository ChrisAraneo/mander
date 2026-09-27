import type { Action } from '@mander/engine';
import { FIXED_STEP_MS } from '@mander/model';
import { chain } from '@mander/utils';
import { times } from 'lodash-es';
import {
  animationFrames,
  concatMap,
  map,
  type Observable,
  pairwise,
  scan,
  share,
} from 'rxjs';

import { MAX_STEPS_PER_FRAME, TIME_SCALE } from './consts';

const TICK: Action = { type: 'TICK' };

export interface Pulse {
  steps: number;
  alpha: number;
}

interface Carry {
  carryMs: number;
  steps: number;
}

const createEmptyCarry = (): Carry => ({ carryMs: 0, steps: 0 });

const advanceCarry = (carry: Carry, deltaMs: number): Carry =>
  chain(carry.carryMs + deltaMs * TIME_SCALE)
    .thru((carried) => Math.min(carried, FIXED_STEP_MS * MAX_STEPS_PER_FRAME))
    .thru((carried): Carry => ({
      steps: Math.floor(carried / FIXED_STEP_MS),
      carryMs: carried % FIXED_STEP_MS,
    }))
    .value();

export const createFixedPulses = (): Observable<Pulse> =>
  animationFrames().pipe(
    pairwise(),
    map(([previous, current]) => current.timestamp - previous.timestamp),
    scan(advanceCarry, createEmptyCarry()),
    map((carry): Pulse => ({
      steps: carry.steps,
      alpha: carry.carryMs / FIXED_STEP_MS,
    })),
    share(),
  );

export const createPulseTicks = (
  pulses$: Observable<Pulse>,
): Observable<Action> =>
  pulses$.pipe(concatMap((pulse) => times(pulse.steps, () => TICK)));
