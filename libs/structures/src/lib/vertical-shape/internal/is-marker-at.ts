import { every, includes } from 'lodash-es';
import type { Layer } from '../../types/layer';

export const isMarkerAt = (
  structure: Layer,
  marker: number,
  row: number,
  column: number,
): boolean =>
  structure[row]?.[column] === marker &&
  every(
    structure,
    (cells, cellsRow) => !includes(cells, marker) || cellsRow === row,
  ) &&
  every(
    structure[row],
    (cell, cellColumn) => cell !== marker || cellColumn === column,
  );
