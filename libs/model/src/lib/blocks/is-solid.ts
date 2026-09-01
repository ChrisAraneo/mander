import { match } from 'ts-pattern';

import type { Level } from '../level/level';
import { isSolidTile } from './is-solid-tile';

const isBesideLevel = (level: Level, tileX: number): boolean =>
  tileX < 0 || tileX >= level.width;

export const isSolid = (level: Level, tileX: number, tileY: number): boolean =>
  match(isBesideLevel(level, tileX))
    .with(true, () => !level.isOpenSided)
    .otherwise(
      () =>
        tileY >= 0 &&
        tileY < level.height &&
        isSolidTile(level.tiles[tileY]?.[tileX]),
    );
