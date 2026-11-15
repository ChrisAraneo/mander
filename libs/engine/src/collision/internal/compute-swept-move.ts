import { match } from 'ts-pattern';
import type { AxisMove } from '../types/axis-move';
import { computeSweptSubstep } from './compute-swept-substep';
import type { Sweep } from './types/sweep';

export const computeSweptMove = (
  sweep: Sweep,
  direction: number,
  position: number,
  remaining: number,
): AxisMove =>
  match(remaining === 0)
    .with(true, (): AxisMove => ({ position, isBlocked: false }))
    .otherwise(() =>
      computeSweptSubstep(sweep, direction, position, remaining),
    );
