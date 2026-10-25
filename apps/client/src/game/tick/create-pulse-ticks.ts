import type { Action } from '@mander/engine';
import { concatMap, type Observable } from 'rxjs';
import { createTicks } from './internal/create-ticks';
import type { Pulse } from './types/pulse';

export const createPulseTicks = (
  pulses: Observable<Pulse>,
): Observable<Action> => pulses.pipe(concatMap(createTicks));
