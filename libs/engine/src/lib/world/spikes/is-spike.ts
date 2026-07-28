import { includes } from 'lodash-es';
import { match, P } from 'ts-pattern';

import type { TileMap } from '@mander/model';
import { SPIKE_TILES } from './constants';

export const isSpike = (
  level: TileMap,
  tileX: number,
  tileY: number,
): boolean =>
  match(true)
    .with(
      P.when(() => tileX < 0 || tileX >= level.width),
      () => false,
    )
    .with(
      P.when(() => tileY < 0 || tileY >= level.height),
      () => false,
    )
    .otherwise(() => includes(SPIKE_TILES, level.tiles[tileY][tileX]));
