import { type Level, TILE_SOLID } from '@mander/generator';

export const solidAt = (level: Level, tileX: number, tileY: number): boolean =>
  tileX >= 0 &&
  tileX < level.width &&
  tileY >= 0 &&
  tileY < level.height &&
  level.tiles[tileY][tileX] === TILE_SOLID;
