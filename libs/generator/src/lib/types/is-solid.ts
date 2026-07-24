import { match, P } from 'ts-pattern';

import { TILE_SOLID } from './constants';
import type { Level } from './level';

export const isSolid = (level: Level, tileX: number, tileY: number): boolean =>
  match(true)
    .with(P.when(() => tileX < 0 || tileX >= level.width), () => true)
    .with(P.when(() => tileY < 0 || tileY >= level.height), () => false)
    .otherwise(() => level.tiles[tileY][tileX] === TILE_SOLID);
