import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_GEM } from './tile-gem';

export const findGemTiles = (level: Level): Point[] =>
  findTiles(level, TILE_GEM);
