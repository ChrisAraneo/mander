import type { Level } from '../level/level';
import { isSolidTile } from './is-solid-tile';

export const isSolid = (level: Level, tileX: number, tileY: number): boolean =>
  tileX < 0 ||
  tileX >= level.width ||
  tileY < 0 ||
  tileY >= level.height ||
  isSolidTile(level.tiles[tileY]?.[tileX]);
