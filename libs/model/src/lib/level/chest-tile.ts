import type { TilePosition } from '../geometry/tile-position';
import { TILE_CHEST } from './constants';
import { findTile } from './find-tile';
import type { Level } from './level';

export const chestTile = (level: Level): TilePosition | null =>
  findTile(level, TILE_CHEST);
