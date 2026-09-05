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

/**
 * What one frame buys: `steps` whole simulation steps, and `alpha` - how far the
 * time left over carries past the last of them. The simulation runs on `steps`,
 * the screen draws with `alpha`, and neither has to match the refresh rate.
 */
export interface Pulse {
  steps: number;
  alpha: number;
}

interface Carry {
  carryMs: number;
  steps: number;
}

const emptyCarry = (): Carry => ({ carryMs: 0, steps: 0 });

const nextCarry = (carry: Carry, deltaMs: number): Carry =>
  chain(carry.carryMs + deltaMs * TIME_SCALE)
    .thru((carried) => Math.min(carried, FIXED_STEP_MS * MAX_STEPS_PER_FRAME))
    .thru((carried): Carry => ({
      steps: Math.floor(carried / FIXED_STEP_MS),
      carryMs: carried % FIXED_STEP_MS,
    }))
    .value();

/**
 * Shared, so every consumer of one frame sees the same pulse. Subscribers are
 * served in subscription order: subscribe the simulation before the renderer so
 * a frame's steps have run by the time it is drawn.
 */
export const fixedPulses = (): Observable<Pulse> =>
  animationFrames().pipe(
    pairwise(),
    map(([previous, current]) => current.timestamp - previous.timestamp),
    scan(nextCarry, emptyCarry()),
    map((carry): Pulse => ({
      steps: carry.steps,
      alpha: carry.carryMs / FIXED_STEP_MS,
    })),
    share(),
  );

/** The pulse's steps as actions, for a reducer pipeline to fold over. */
export const pulseTicks = (pulses$: Observable<Pulse>): Observable<Action> =>
  pulses$.pipe(concatMap((pulse) => times(pulse.steps, () => TICK)));
