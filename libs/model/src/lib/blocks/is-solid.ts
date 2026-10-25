import { match } from 'ts-pattern';
import type { Level } from '../types/level';
import { isBesideLevel } from './internal/is-beside-level';
import { isSolidTile } from './is-solid-tile';

export const isSolid = (level: Level, tileX: number, tileY: number): boolean =>
  match(isBesideLevel(level, tileX))
    .with(true, () => !level.isOpenSided)
    .otherwise(
      () =>
        tileY >= 0 &&
        tileY < level.height &&
        isSolidTile(level.tiles[tileY]?.[tileX]),
    );
