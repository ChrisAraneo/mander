import type { Structure } from '@mander/generator';
import { forEach, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { BLOCK, STRUCTURE_HEIGHT, SECTOR_WIDTH } from '@mander/generator';
import { drawBlockCell } from './draw-block-cell';

const COLUMNS = range(SECTOR_WIDTH);
const ROWS = range(STRUCTURE_HEIGHT);

export const drawBlocks = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  forEach(ROWS, (row) =>
    forEach(COLUMNS, (column) =>
      match(grid[row][column])
        .with(BLOCK, () => drawBlockCell(context, grid, row, column))
        .otherwise(() => undefined),
    ),
  );
};
