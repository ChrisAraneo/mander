import type { AxisMove } from '../types/axis-move';
import { computeSweptMove } from './compute-swept-move';
import { getSweepOrigin } from './get-sweep-origin';
import type { Sweep } from './types/sweep';

export const computeAxisMove = (sweep: Sweep): AxisMove =>
  computeSweptMove(
    sweep,
    Math.sign(sweep.delta),
    getSweepOrigin(sweep),
    sweep.delta,
  );
