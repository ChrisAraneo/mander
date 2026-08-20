import type { Point } from '@mander/utils';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';
import { TILE_BEARTRAP } from './beartrap-spawn';

export const findBeartrapTiles = (level: Level): Point[] =>
  findTiles(level, TILE_BEARTRAP);
