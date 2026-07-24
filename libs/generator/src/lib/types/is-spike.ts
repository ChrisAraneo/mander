import { includes } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { TILE_SPIKE, TILE_SPIKE_CEILING } from './constants';
import type { Level } from './level';
import type { Tile } from './tile';

const SPIKE_TILES: Tile[] = [TILE_SPIKE, TILE_SPIKE_CEILING];

export const isSpike = (level: Level, tileX: number, tileY: number): boolean =>
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
