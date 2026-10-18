import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';
import { TILE_BEARTRAP } from './beartrap-spawn';

export const findBeartrapTiles = (level: Level): Point[] =>
  findTiles(level, TILE_BEARTRAP);
