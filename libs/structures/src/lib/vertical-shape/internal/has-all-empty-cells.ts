import { TILE_AIR } from '@mander/model';
import { every } from 'lodash-es';
import type { Layer } from '../../types/layer';
import { isEmptyCell } from './is-empty-cell';

export const hasAllEmptyCells = (
  structure: Layer,
  rows: readonly number[],
  columns: readonly number[],
): boolean =>
  every(rows, (row) =>
    every(columns, (column) =>
      isEmptyCell(structure[row]?.[column] ?? TILE_AIR),
    ),
  );
