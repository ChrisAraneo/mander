import { round, size, take } from 'lodash-es';
import type { BeartrapShuffledCells } from './types/beartrap-shuffled-cells';
import type { BeartrapSlice } from './types/beartrap-slice';

export const sliceBeartrapCells = ({
  tiles,
  rate,
  cells,
}: BeartrapShuffledCells): BeartrapSlice => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
