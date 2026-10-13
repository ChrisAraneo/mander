import { round, size, take } from 'lodash-es';
import type { Cell } from '../../types/cell';
import type { sortBeartrapCellsRandomly } from './sort-beartrap-cells-randomly';

export const sliceBeartrapCells = ({
  tiles,
  rate,
  cells,
}: ReturnType<typeof sortBeartrapCellsRandomly>): BeartrapSlice => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});

export interface BeartrapSlice {
  tiles: number[][];
  cells: Cell[];
}
