import { round, size, take } from 'lodash-es';
import type { shuffleBeartrapCells } from './shuffle-beartrap-cells';

export const pickBeartrapCells = ({
  tiles,
  rate,
  cells,
}: ReturnType<typeof shuffleBeartrapCells>) => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
