import { map } from 'lodash-es';
import { match } from 'ts-pattern';

export const patchGridCell = (
  grid: number[][],
  row: number,
  column: number,
  value: number,
): number[][] =>
  map(grid, (cells, rowIndex) =>
    match(rowIndex)
      .with(row, () =>
        map(cells, (cell, columnIndex) =>
          match(columnIndex)
            .with(column, () => value)
            .otherwise(() => cell),
        ),
      )
      .otherwise(() => cells),
  );
