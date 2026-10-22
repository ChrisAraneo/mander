import { round, size, take } from 'lodash-es';
import type { CannonCells } from './types/cannon-cells';
import type { CannonSlice } from './types/cannon-slice';

export const sliceCannonCells = ({
  tiles,
  rate,
  cells,
}: CannonCells): CannonSlice => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
