import { match, P } from 'ts-pattern';

import type { Level } from './level';
import { SOLID_TILES } from '../tiles/consts';
import { includes } from 'lodash-es';

export const isSolid = (level: Level, tileX: number, tileY: number): boolean =>
  match(true)
    .with(
      P.when(() => tileX < 0 || tileX >= level.width),
      () => true,
    )
    .with(
      P.when(() => tileY < 0 || tileY >= level.height),
      () => false,
    )
    .otherwise(() => includes(SOLID_TILES, level.tiles[tileY][tileX]));
