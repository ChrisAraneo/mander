import type { Point } from '@mander/utils';
import { findTiles } from '../tile/find-tiles';
import type { Level } from '../level/level';
import { TILE_GEM } from './gem';

export const findGemTiles = (level: Level): Point[] =>
  findTiles(level, TILE_GEM);
