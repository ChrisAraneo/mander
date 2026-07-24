import { TILE_SIZE } from '@mander/generator';
import { chain, floor } from 'lodash-es';
import { match } from 'ts-pattern';

import type { AxisMove } from './axis-move';
import { EPSILON, SUBSTEP } from './internal-constants';

export interface Sweep {
  origin: number;
  delta: number;
  size: number;
  collides: (position: number) => boolean;
}

const blockedPosition = (
  nextPosition: number,
  direction: number,
  size: number,
): number =>
  match(direction > 0)
    .with(
      true,
      () =>
        floor((nextPosition + size - EPSILON) / TILE_SIZE) * TILE_SIZE - size,
    )
    .otherwise(() => (floor(nextPosition / TILE_SIZE) + 1) * TILE_SIZE);

const advance = (
  config: Sweep,
  direction: number,
  current: number,
  remaining: number,
): AxisMove =>
  match(remaining === 0)
    .with(true, (): AxisMove => ({ position: current, isBlocked: false }))
    .otherwise(
      (): AxisMove =>
        chain(direction * Math.min(Math.abs(remaining), SUBSTEP))
          .thru((step) => ({ step, nextPosition: current + step }))
          .thru(({ step, nextPosition }) =>
            match(config.collides(nextPosition))
              .with(
                true,
                (): AxisMove => ({
                  position: blockedPosition(
                    nextPosition,
                    direction,
                    config.size,
                  ),
                  isBlocked: true,
                }),
              )
              .otherwise(
                (): AxisMove =>
                  advance(config, direction, nextPosition, remaining - step),
              ),
          )
          .value(),
    );

export const sweep = (config: Sweep): AxisMove =>
  advance(config, Math.sign(config.delta), config.origin, config.delta);
