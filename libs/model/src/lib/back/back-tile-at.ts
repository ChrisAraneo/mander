import { inRange } from 'lodash-es';
import { match } from 'ts-pattern';

import { TILE_AIR } from '../air/air';
import type { Level } from '../level/level';
import type { Tile } from '../tile/tile';

export const backTileAt = (level: Level, tileX: number, tileY: number): Tile =>
  match(inRange(tileX, 0, level.width) && inRange(tileY, 0, level.height))
    .with(true, () => level.backTiles?.[tileY]?.[tileX] ?? TILE_AIR)
    .otherwise(() => TILE_AIR);
