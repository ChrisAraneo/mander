import { match } from 'ts-pattern';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_PORTAL } from './tile-portal';

export const findPortalBottomTile = (level: Level, point: Point): Point =>
  match(
    point.y + 1 < level.height &&
      level.tiles[point.y + 1][point.x] === TILE_PORTAL,
  )
    .with(true, () =>
      findPortalBottomTile(level, { x: point.x, y: point.y + 1 }),
    )
    .otherwise(() => point);
