import type { Structure } from '@mander/generator';
import { forEach, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { CELL } from '../config/constants';
import {
  SECTOR_WIDTH,
  SPIKE,
  SPIKE_CEILING,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { drawSpikeCell } from './draw-spike-cell';

const COLUMNS = range(SECTOR_WIDTH);
const ROWS = range(STRUCTURE_HEIGHT);

export const drawSpikes = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  forEach(ROWS, (row) =>
    forEach(COLUMNS, (column) =>
      match(grid[row][column])
        .with(SPIKE, () =>
          drawSpikeCell(context, column * CELL, row * CELL, false),
        )
        .with(SPIKE_CEILING, () =>
          drawSpikeCell(context, column * CELL, row * CELL, true),
        )
        .otherwise(() => undefined),
    ),
  );
};
