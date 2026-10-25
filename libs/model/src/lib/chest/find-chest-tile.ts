import { findTile } from '../tile/find-tile';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_CHEST } from './tile-chest';

export const findChestTile = (level: Level): Point | null =>
  findTile(level, TILE_CHEST);
