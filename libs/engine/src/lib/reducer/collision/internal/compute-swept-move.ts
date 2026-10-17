import { chain } from '@mander/utils';
import { match } from 'ts-pattern';
import { SUBSTEP } from '../consts';
import type { AxisMove } from '../types/axis-move';
import { computeBlockedPosition } from './compute-blocked-position';
import type { Sweep } from './types/sweep';

export const computeSweptMove = (
  config: Sweep,
  direction: number,
  current: number,
  remaining: number,
): AxisMove =>
  match(remaining === 0)
    .with(true, (): AxisMove => ({ position: current, isBlocked: false }))
    .otherwise((): AxisMove =>
      chain(direction * Math.min(Math.abs(remaining), SUBSTEP))
        .thru((step) => ({ step, nextPosition: current + step }))
        .thru(({ step, nextPosition }) =>
          match(config.isColliding(nextPosition))
            .with(true, (): AxisMove => ({
              position: computeBlockedPosition(
                nextPosition,
                direction,
                config.size,
              ),
              isBlocked: true,
            }))
            .otherwise((): AxisMove =>
              computeSweptMove(
                config,
                direction,
                nextPosition,
                remaining - step,
              ),
            ),
        )
        .value(),
    );
