import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { SUBSTEP } from '../consts';
import type { AxisMove } from '../types/axis-move';
import { computeBlockedPosition } from './compute-blocked-position';
import { getSweepSize } from './get-sweep-size';
import { isSweepColliding } from './is-sweep-colliding';
import type { Sweep } from './types/sweep';

export const computeSweptMove = (
  sweep: Sweep,
  direction: number,
  current: number,
  remaining: number,
): AxisMove =>
  match(remaining === 0)
    .with(true, (): AxisMove => ({ position: current, isBlocked: false }))
    .otherwise((): AxisMove =>
      pipe(
        direction * Math.min(Math.abs(remaining), SUBSTEP),
        (step) => ({ step, nextPosition: current + step }),
        ({ step, nextPosition }) =>
          match(isSweepColliding(sweep, nextPosition))
            .with(true, (): AxisMove => ({
              position: computeBlockedPosition(
                nextPosition,
                direction,
                getSweepSize(sweep),
              ),
              isBlocked: true,
            }))
            .otherwise((): AxisMove =>
              computeSweptMove(
                sweep,
                direction,
                nextPosition,
                remaining - step,
              ),
            ),
      ),
    );
