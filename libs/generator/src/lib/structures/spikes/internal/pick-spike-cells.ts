import { round, size, take } from 'lodash-es';
import type { shuffleSpikeCells } from './shuffle-spike-cells';

export const pickSpikeCells = ({
  tiles,
  rate,
  cells,
}: ReturnType<typeof shuffleSpikeCells>) => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
