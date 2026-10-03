import { sortBy } from 'lodash-es';
import type { findBeartrapCells } from './find-beartrap-cells';

export const shuffleBeartrapCells = ({
  tiles,
  random,
  rate,
  cells,
}: ReturnType<typeof findBeartrapCells>) => ({
  tiles,
  rate,
  cells: sortBy(cells, () => random.rollFloat()),
});
