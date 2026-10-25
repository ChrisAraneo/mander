import type { Action } from '@mander/engine';
import { constant, times } from 'lodash-es';
import type { Pulse } from '../types/pulse';

const TICK: Action = { type: 'TICK' };

export const createTicks = (pulse: Pulse): Action[] =>
  times(pulse.steps, constant(TICK));
