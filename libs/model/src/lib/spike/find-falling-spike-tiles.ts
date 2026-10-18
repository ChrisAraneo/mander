import type { Point } from '../geometry/point';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';
import { TILE_SPIKE_FALLING } from './spike';

export const findFallingSpikeTiles = (level: Level): Point[] =>
  findTiles(level, TILE_SPIKE_FALLING);
