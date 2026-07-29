import { match, P } from 'ts-pattern';

import type { Level } from '../level/level';
import { SOLID_TILES } from './consts';
import { includes } from 'lodash-es';

const { when } = P;

export const isSolid = (level: Level, tileX: number, tileY: number): boolean =>
  match(true)
    .with(
      when(() => tileX < 0 || tileX >= level.width),
      () => true,
    )
    .with(
      when(() => tileY < 0 || tileY >= level.height),
      () => false,
    )
    .otherwise(() => includes(SOLID_TILES, level.tiles[tileY][tileX]));
