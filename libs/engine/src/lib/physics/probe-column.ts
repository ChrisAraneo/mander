import { TILE_SIZE } from '../world';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';

import { ENEMY_WIDTH } from '../state';

export const probeColumn = (originX: number, facing: 1 | -1): number =>
  floor(
    match(facing > 0)
      .with(true, () => originX + ENEMY_WIDTH + 1)
      .otherwise(() => originX - 1) / TILE_SIZE,
  );
