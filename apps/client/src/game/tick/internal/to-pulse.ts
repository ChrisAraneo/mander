import { FIXED_STEP_MS } from '@mander/model';
import type { Pulse } from '../types/pulse';
import type { Carry } from './types/carry';

export const toPulse = (carry: Carry): Pulse => ({
  steps: carry.steps,
  alpha: carry.carryMs / FIXED_STEP_MS,
});
