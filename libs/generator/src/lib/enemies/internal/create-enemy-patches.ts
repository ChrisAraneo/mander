import { map } from 'lodash-es';
import type { TilePatch } from '../../types/tile-patch';
import { takeRandomEnemyTile } from './take-random-enemy-tile';
import type { EnemyCells } from './types/enemy-cells';
import type { EnemyPatch } from './types/enemy-patch';

export const createEnemyPatches = ({
  tiles,
  chances,
  cells,
  random,
}: EnemyCells): EnemyPatch => ({
  tiles,
  patches: map(cells, (cell): TilePatch => ({
    row: cell.row,
    column: cell.column,
    tile: takeRandomEnemyTile(tiles, cell, chances, random),
  })),
});
