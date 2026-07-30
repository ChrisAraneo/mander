import { TILE_SIZE } from '@mander/model';
import { floor } from 'lodash-es';
import { match } from 'ts-pattern';

import { ENEMY_WIDTH } from './consts';

export const probeColumn = (originX: number, facing: 1 | -1): number =>
  floor(
    match(facing > 0)
      .with(true, () => originX + ENEMY_WIDTH + 1)
      .otherwise(() => originX - 1) / TILE_SIZE,
  );
