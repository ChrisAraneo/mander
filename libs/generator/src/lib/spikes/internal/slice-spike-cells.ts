import { round, size, take } from 'lodash-es';
import type { sortSpikeCellsRandomly } from './sort-spike-cells-randomly';

export const sliceSpikeCells = ({
  tiles,
  rate,
  cells,
}: ReturnType<typeof sortSpikeCellsRandomly>) => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
