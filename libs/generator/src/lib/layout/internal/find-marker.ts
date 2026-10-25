import { getFront, type Sector } from '@mander/structures';
import { find, indexOf, map } from 'lodash-es';
import type { Cell } from '../../types/cell';

const NOT_FOUND = -1;

export const findMarker = (
  structure: Sector,
  marker: number,
): Cell | undefined =>
  find(
    map(getFront(structure), (cells, row): Cell => ({
      row,
      column: indexOf(cells, marker),
    })),
    (cell) => cell.column !== NOT_FOUND,
  );
