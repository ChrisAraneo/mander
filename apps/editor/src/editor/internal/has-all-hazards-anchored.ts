import {
  isSolidTile,
  TILE_BEARTRAP,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { every, size } from 'lodash-es';
import { match } from 'ts-pattern';

export const hasAllHazardsAnchored = (grid: number[][]): boolean =>
  every(grid, (cells, row) =>
    every(cells, (cell, column) =>
      match(cell)
        .with(
          TILE_SPIKE,
          TILE_BEARTRAP,
          () => row + 1 < size(grid) && isSolidTile(grid[row + 1][column]),
        )
        .with(
          TILE_SPIKE_CEILING,
          TILE_SPIKE_FALLING,
          () => row - 1 >= 0 && isSolidTile(grid[row - 1][column]),
        )
        .otherwise(() => true),
    ),
  );
