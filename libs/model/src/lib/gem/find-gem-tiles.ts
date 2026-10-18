import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';
import { TILE_GEM } from './gem';

export const findGemTiles = (level: Level): Point[] =>
  findTiles(level, TILE_GEM);
