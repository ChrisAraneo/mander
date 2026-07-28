import type { TilePosition } from '../geometry/tile-position';
import { TILE_KEY } from './constants';
import { findTile } from './find-tile';
import type { Level } from './level';

export const keyTile = (level: Level): TilePosition | null =>
  findTile(level, TILE_KEY);
