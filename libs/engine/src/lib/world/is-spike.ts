import { includes } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { TILE_SPIKE, TILE_SPIKE_CEILING } from './constants';
import type { Tile } from './tile';
import type { TileMap } from './tile-map';

const SPIKE_TILES: Tile[] = [TILE_SPIKE, TILE_SPIKE_CEILING];

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
