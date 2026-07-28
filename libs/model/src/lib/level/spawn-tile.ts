import type { TilePosition } from '../geometry/tile-position';
import { TILE_SPAWN } from './constants';
import { findTile } from './find-tile';
import type { Level } from './level';

export const spawnTile = (level: Level): TilePosition | null =>
  findTile(level, TILE_SPAWN);
