import {
  type Structure,
  ENEMY,
  SECTOR_WIDTH,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { forEach, noop, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { CELL } from '../../constants';
import { drawEnemyMarker } from './draw-enemy-marker';
import { isEnemyStranded } from './is-enemy-stranded';

const COLUMNS = range(SECTOR_WIDTH);
const ROWS = range(STRUCTURE_HEIGHT);

export const drawEnemies = (
  context: CanvasRenderingContext2D,
  grid: Structure,
): void => {
  forEach(ROWS, (row) =>
    forEach(COLUMNS, (column) =>
      match(grid[row][column])
        .with(ENEMY, () =>
          drawEnemyMarker(
            context,
            column * CELL,
            row * CELL,
            isEnemyStranded(grid, row, column),
          ),
        )
        .otherwise(noop),
    ),
  );
};
