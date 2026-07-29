import type { Point } from '@mander/utils';
import { findTile } from '../../level/find-tile';
import type { Level } from '../../level/level';
import { TILE_SPAWN } from '../../tiles/spawn';

export const spawnTile = (level: Level): Point | null =>
  findTile(level, TILE_SPAWN);
