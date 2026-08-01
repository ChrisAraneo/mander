import { TILE_ENEMY } from '@mander/model';
import type { Point } from '@mander/utils';
import { filter, flatMap, map, range, size } from 'lodash-es';

export const structureEnemies = (grid: number[][]): Point[] =>
  flatMap(grid, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => cells[column] === TILE_ENEMY),
      (column): Point => ({ x: column, y: row }),
    ),
  );
