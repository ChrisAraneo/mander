import { filter, map } from 'lodash-es';
import type { StructureRow } from './types/structure-row';

export const sliceRowsBefore = (
  rows: StructureRow[],
  boundary: number,
): number[][] =>
  map(
    filter(rows, (row) => row.at < boundary),
    (row) => row.cells,
  );
