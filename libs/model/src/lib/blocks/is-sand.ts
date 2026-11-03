import type { Level } from '../types/level';
import { TILE_SAND } from './tile-sand';

export const isSand = (level: Level, tileX: number, tileY: number): boolean =>
  level.tiles[tileY]?.[tileX] === TILE_SAND;
