import { match, P } from 'ts-pattern';

import { TILE_SPIKE } from './constants';
import type { Level } from './level';

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
    .otherwise(() => level.tiles[tileY][tileX] === TILE_SPIKE);
