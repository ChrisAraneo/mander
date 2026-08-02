import type { Point } from '@mander/utils';
import { match } from 'ts-pattern';
import type { Level } from '../level/level';
import { TILE_PORTAL } from './portal';

export const findPortalBottomTile = (level: Level, point: Point): Point =>
  match(
    point.y + 1 < level.height &&
      level.tiles[point.y + 1][point.x] === TILE_PORTAL,
  )
    .with(true, () =>
      findPortalBottomTile(level, { x: point.x, y: point.y + 1 }),
    )
    .otherwise(() => point);
