import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_BEARTRAP } from './tile-beartrap';

export const findBeartrapTiles = (level: Level): Point[] =>
  findTiles(level, TILE_BEARTRAP);
