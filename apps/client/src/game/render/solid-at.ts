import { isSolidTile, type Level } from '@mander/engine';

export const solidAt = (level: Level, tileX: number, tileY: number): boolean =>
  tileX >= 0 &&
  tileX < level.width &&
  tileY >= 0 &&
  tileY < level.height &&
  isSolidTile(level.tiles[tileY][tileX]);
