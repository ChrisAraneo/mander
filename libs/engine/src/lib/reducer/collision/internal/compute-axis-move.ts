import type { AxisMove } from '../types/axis-move';
import { computeSweptMove } from './compute-swept-move';
import type { Sweep } from './types/sweep';

export const computeAxisMove = (config: Sweep): AxisMove =>
  computeSweptMove(
    config,
    Math.sign(config.delta),
    config.origin,
    config.delta,
  );
