import {
  getFront,
  type Sector,
  STRUCTURE_END,
  STRUCTURE_HEIGHT,
  STRUCTURE_START,
  STRUCTURE_WIDTH,
} from '@mander/structures';
import { chain } from '@mander/utils';
import { find, indexOf, map } from 'lodash-es';
import type { Cell } from '../../types/cell';
import type { StructurePlacement } from './types/structure-placement';

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

export const computePlacementAfter = (
  previous: StructurePlacement,
  structure: Sector,
): StructurePlacement =>
  chain({
    exit: findMarker(previous.structure, STRUCTURE_END) ?? DEFAULT_END,
    entry: findMarker(structure, STRUCTURE_START) ?? DEFAULT_START,
  })
    .thru(({ exit, entry }): StructurePlacement => ({
      structure,
      row: previous.row + exit.row - entry.row,
      column: previous.column + exit.column + COLUMNS_PAST_EXIT - entry.column,
    }))
    .value();
