import { findTileCells } from '../tile/find-tile-cells';
import type { TileCell } from '../tile/types/tile-cell';
import type { Level } from '../types/level';
import { isCannonTile } from './is-cannon-tile';

export const findCannonTiles = (level: Level): TileCell[] =>
  findTileCells(level, isCannonTile);
