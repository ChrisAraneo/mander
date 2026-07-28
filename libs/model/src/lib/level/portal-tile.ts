import type { TilePosition } from '../geometry/tile-position';
import { TILE_PORTAL } from './constants';
import { findTile } from './find-tile';
import type { Level } from './level';

export const portalTile = (level: Level): TilePosition | null =>
  findTile(level, TILE_PORTAL);
