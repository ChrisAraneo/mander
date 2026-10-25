import { findTiles } from '../tile/find-tiles';
import type { Level } from '../types/level';
import type { Point } from '../types/point';
import { TILE_SPIKE_FALLING } from './tile-spike-falling';

export const findFallingSpikeTiles = (level: Level): Point[] =>
  findTiles(level, TILE_SPIKE_FALLING);
