import { isSolidTile, type Tile } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import type { Spot } from '../types/spot';
import { isClear } from './internal/is-clear';

export const filterStandingSpots = (
  tiles: Tile[][],
  clearance: number,
): Spot[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(
        range(size(cells)),
        (column) =>
          isSolidTile(cells[column]) && isClear(tiles, row, column, clearance),
      ),
      (column): Spot => ({ row, column }),
    ),
  );
