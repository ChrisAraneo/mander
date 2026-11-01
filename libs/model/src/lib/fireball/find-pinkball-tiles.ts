import { TILE_PINKBALL } from '../blocks/tile-pinkball';
import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';

export const findPinkballTiles = (level: Level): Point[] =>
  findTiles(level, TILE_PINKBALL);
