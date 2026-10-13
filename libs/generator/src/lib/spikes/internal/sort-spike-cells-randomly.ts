import { sortBy } from 'lodash-es';
import type { filterSpikeCells } from './filter-spike-cells';

export const sortSpikeCellsRandomly = ({
  tiles,
  rate,
  cells,
  random,
}: ReturnType<typeof filterSpikeCells>) => ({
  tiles,
  rate,
  cells: sortBy(cells, () => random.rollFloat()),
});
