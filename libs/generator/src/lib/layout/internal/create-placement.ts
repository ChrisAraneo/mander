import type { Sector } from '@mander/structures';
import type { Cell } from '../../types/cell';
import type { StructurePlacement } from './types/structure-placement';

const COLUMNS_PAST_EXIT = 1;

export const createPlacement = (
  previous: StructurePlacement,
  structure: Sector,
  exit: Cell,
  entry: Cell,
): StructurePlacement => ({
  structure,
  row: previous.row + exit.row - entry.row,
  column: previous.column + exit.column + COLUMNS_PAST_EXIT - entry.column,
});
