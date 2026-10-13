import { sortBy } from 'lodash-es';
import type { filterBeartrapCells } from './filter-beartrap-cells';

export const sortBeartrapCellsRandomly = ({
  tiles,
  rate,
  cells,
  random,
}: ReturnType<typeof filterBeartrapCells>) => ({
  tiles,
  rate,
  cells: sortBy(cells, () => random.rollFloat()),
});
