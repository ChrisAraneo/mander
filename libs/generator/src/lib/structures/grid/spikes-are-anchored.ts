import { every, range } from 'lodash-es';
import { match } from 'ts-pattern';

import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '../../consts';
import { BLOCK, SPIKE, SPIKE_CEILING, type Structure } from '../types';

const isAnchored = (grid: Structure, row: number, column: number): boolean =>
  match(grid[row][column])
    .with(
      SPIKE,
      () => row + 1 < STRUCTURE_HEIGHT && grid[row + 1][column] === BLOCK,
    )
    .with(SPIKE_CEILING, () => row - 1 >= 0 && grid[row - 1][column] === BLOCK)
    .otherwise(() => true);

export const spikesAreAnchored = (grid: Structure): boolean =>
  every(range(STRUCTURE_HEIGHT), (row) =>
    every(range(SECTOR_WIDTH), (column) => isAnchored(grid, row, column)),
  );
