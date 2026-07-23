import { TILE_SPIKE } from './constants';
import type { Level } from './level';

export const isSpike = (
  level: Level,
  tileX: number,
  tileY: number,
): boolean => {
  if (tileX < 0 || tileX >= level.width) return false;
  if (tileY < 0 || tileY >= level.height) return false;
  return level.tiles[tileY][tileX] === TILE_SPIKE;
};
