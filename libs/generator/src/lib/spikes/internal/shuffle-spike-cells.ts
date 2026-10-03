import { sortBy } from 'lodash-es';
import type { findSpikeCells } from './find-spike-cells';

export const shuffleSpikeCells = ({
  tiles,
  random,
  rate,
  cells,
}: ReturnType<typeof findSpikeCells>) => ({
  tiles,
  rate,
  cells: sortBy(cells, () => random.rollFloat()),
});
