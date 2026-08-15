import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { chain } from '@mander/utils';
import { match } from 'ts-pattern';

import { EPSILON, SUBSTEP } from './consts';
import type { AxisMove } from './types/axis-move';
import type { Sweep } from './types/sweep';

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
    .otherwise((): AxisMove =>
      chain(direction * Math.min(Math.abs(remaining), SUBSTEP))
        .thru((step) => ({ step, nextPosition: current + step }))
        .thru(({ step, nextPosition }) =>
          match(config.collides(nextPosition))
            .with(true, (): AxisMove => ({
              position: blockedPosition(nextPosition, direction, config.size),
              isBlocked: true,
            }))
            .otherwise((): AxisMove =>
              advance(config, direction, nextPosition, remaining - step),
            ),
        )
        .value(),
    );

export const sweep = (config: Sweep): AxisMove =>
  advance(config, Math.sign(config.delta), config.origin, config.delta);
