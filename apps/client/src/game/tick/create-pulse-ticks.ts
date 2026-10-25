import type { Action } from '@mander/engine';
import { constant, times } from 'lodash-es';
import { concatMap, type Observable } from 'rxjs';
import type { Pulse } from './types/pulse';

const TICK: Action = { type: 'TICK' };

const createTicks = (pulse: Pulse): Action[] =>
  times(pulse.steps, constant(TICK));

export const createPulseTicks = (
  pulses: Observable<Pulse>,
): Observable<Action> => pulses.pipe(concatMap(createTicks));
