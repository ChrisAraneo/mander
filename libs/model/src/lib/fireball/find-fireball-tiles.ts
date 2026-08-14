import type { Point } from '@mander/utils';
import { TILE_FIREBALL } from '../blocks/fireball';
import type { Level } from '../level/level';
import { findTiles } from '../tile/find-tiles';

export const findFireballTiles = (level: Level): Point[] =>
  findTiles(level, TILE_FIREBALL);
