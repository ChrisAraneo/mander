import { match, P } from 'ts-pattern';

import type { Level } from '../level/level';
import { TILE_BEARTRAP } from './beartrap-spawn';

const { when } = P;

export const isBeartrap = (
  level: Level,
  tileX: number,
  tileY: number,
): boolean =>
  match(true)
    .with(
      when(
        () =>
          tileX < 0 ||
          tileX >= level.width ||
          tileY < 0 ||
          tileY >= level.height,
      ),
      () => false,
    )
    .otherwise(() => level.tiles[tileY][tileX] === TILE_BEARTRAP);
