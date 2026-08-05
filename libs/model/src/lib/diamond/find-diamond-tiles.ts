import type { Point } from '@mander/utils';
import { findTiles } from '../tile/find-tiles';
import type { Level } from '../level/level';
import { TILE_DIAMOND } from './diamond';

export const findDiamondTiles = (level: Level): Point[] =>
  findTiles(level, TILE_DIAMOND);
