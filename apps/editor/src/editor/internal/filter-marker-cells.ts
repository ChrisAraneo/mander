import { STRUCTURE_END, STRUCTURE_START } from '@mander/structures';
import { filter, flatMap, includes, map } from 'lodash-es';
import { pipe } from 'remeda';
import type { MarkerCell } from './types/marker-cell';

const MARKERS = [STRUCTURE_START, STRUCTURE_END];

export const filterMarkerCells = (grid: number[][]): MarkerCell[] =>
  pipe(
    grid,
    (rows) =>
      flatMap(rows, (cells, row) =>
        map(cells, (cell, column): MarkerCell => ({ cell, row, column })),
      ),
    (cells) => filter(cells, ({ cell }) => includes(MARKERS, cell)),
  );
