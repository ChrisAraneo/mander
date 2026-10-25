import { findTile } from '../tile/find-tile';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_KEY } from './tile-key';

export const findKeyTile = (level: Level): Point | null =>
  findTile(level, TILE_KEY);
