import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTile } from '../tile/find-tile';
import { TILE_CHEST } from './chest';

export const findChestTile = (level: Level): Point | null =>
  findTile(level, TILE_CHEST);
