import { FIXED_STEP_MS } from '@mander/model';
import { floor } from 'lodash-es';
import { pipe } from 'remeda';
import { MAX_STEPS_PER_FRAME, TIME_SCALE } from '../consts';
import type { Carry } from './types/carry';

export const nextCarry = (carry: Carry, deltaMs: number): Carry =>
  pipe(
    carry.carryMs + deltaMs * TIME_SCALE,
    (carried) => Math.min(carried, FIXED_STEP_MS * MAX_STEPS_PER_FRAME),
    (carried): Carry => ({
      steps: floor(carried / FIXED_STEP_MS),
      carryMs: carried % FIXED_STEP_MS,
    }),
  );
