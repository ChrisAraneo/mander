import {
  getFront,
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { find, indexOf, map } from 'lodash-es';
import type { Cell } from './cell';
import type { Placement } from './placement';

const NOT_FOUND = -1;

const COLUMNS_PAST_EXIT = 1;

const DEFAULT_START: Cell = { row: STRUCTURE_HEIGHT - 1, column: 0 };

const DEFAULT_END: Cell = {
  row: STRUCTURE_HEIGHT - 1,
  column: STRUCTURE_WIDTH - 1,
};

const findMarker = (structure: Sector, marker: number): Cell | undefined =>
  find(
    map(getFront(structure), (cells, row): Cell => ({
      row,
      column: indexOf(cells, marker),
    })),
    (cell) => cell.column !== NOT_FOUND,
  );

export const getPlacementAfter = (
  previous: Placement,
  structure: Sector,
): Placement => {
  const exit = findMarker(previous.structure, STRUCTURE_END) ?? DEFAULT_END;
  const entry = findMarker(structure, STRUCTURE_START) ?? DEFAULT_START;

  return {
    structure,
    row: previous.row + exit.row - entry.row,
    column: previous.column + exit.column + COLUMNS_PAST_EXIT - entry.column,
  };
};
