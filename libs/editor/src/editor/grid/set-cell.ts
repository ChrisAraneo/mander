import type { Structure } from '@mander/generator';
import { map } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Cell } from '../types/cell';

const setColumn = (row: number[], column: number, value: number): number[] =>
  map(row, (current, index) =>
    match(index === column)
      .with(true, () => value)
      .otherwise(() => current),
  );

export const setCell = (
  grid: Structure,
  cell: Cell,
  value: number,
): Structure =>
  map(grid, (row, index) =>
    match(index === cell.row)
      .with(true, () => setColumn(row, cell.column, value))
      .otherwise(() => row),
  );
