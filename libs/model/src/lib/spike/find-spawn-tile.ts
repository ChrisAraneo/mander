import type { Point } from '@mander/utils';
import { findTile } from '../tile/find-tile';
import type { Level } from '../level/level';
import { TILE_SPAWN } from '../player/spawn';

export const findSpawnTile = (level: Level): Point | null =>
  findTile(level, TILE_SPAWN);
