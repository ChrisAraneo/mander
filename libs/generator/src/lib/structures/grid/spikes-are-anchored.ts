import { every, range } from 'lodash-es';
import { match } from 'ts-pattern';

import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '../../consts';
import { isBlockCell, SPIKE, SPIKE_CEILING, type Structure } from '../types';

const isAnchored = (grid: Structure, row: number, column: number): boolean =>
  match(grid[row][column])
    .with(
      SPIKE,
      () => row + 1 < STRUCTURE_HEIGHT && isBlockCell(grid[row + 1][column]),
    )
    .with(
      SPIKE_CEILING,
      () => row - 1 >= 0 && isBlockCell(grid[row - 1][column]),
    )
    .otherwise(() => true);

export const spikesAreAnchored = (grid: Structure): boolean =>
  every(range(STRUCTURE_HEIGHT), (row) =>
    every(range(SECTOR_WIDTH), (column) => isAnchored(grid, row, column)),
  );
