import { findTileCells } from '../tile/find-tile-cells';
import type { TileCell } from '../tile/types/tile-cell';
import type { Level } from '../types/level';
import { isEnemyTile } from './is-enemy-tile';

export const findEnemySpawns = (level: Level): TileCell[] =>
  findTileCells(level, isEnemyTile);
