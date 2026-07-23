import { TILE_SOLID } from './constants';
import type { Level } from './level';

export const isSolid = (
  level: Level,
  tileX: number,
  tileY: number,
): boolean => {
  if (tileX < 0 || tileX >= level.width) return true;
  if (tileY < 0 || tileY >= level.height) return false;
  return level.tiles[tileY][tileX] === TILE_SOLID;
};
