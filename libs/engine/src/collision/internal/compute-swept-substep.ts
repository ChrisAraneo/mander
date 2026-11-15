import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { AxisMove } from '../types/axis-move';
import { computeBlockedPosition } from './compute-blocked-position';
import { computeSubstepDistance } from './compute-substep-distance';
import { computeSweptMove } from './compute-swept-move';
import { getSweepSize } from './get-sweep-size';
import { isSweepColliding } from './is-sweep-colliding';
import type { Sweep } from './types/sweep';

export const computeSweptSubstep = (
  sweep: Sweep,
  direction: number,
  position: number,
  remaining: number,
): AxisMove =>
  pipe(computeSubstepDistance(direction, remaining), (step) =>
    match(isSweepColliding(sweep, position + step))
      .with(true, (): AxisMove => ({
        position: computeBlockedPosition(
          position + step,
          direction,
          getSweepSize(sweep),
        ),
        isBlocked: true,
      }))
      .otherwise(() =>
        computeSweptMove(sweep, direction, position + step, remaining - step),
      ),
  );
