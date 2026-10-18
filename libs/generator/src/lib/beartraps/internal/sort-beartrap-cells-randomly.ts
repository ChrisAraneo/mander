import { sortBy } from 'lodash-es';
import type { BeartrapCells } from './types/beartrap-cells';
import type { BeartrapShuffledCells } from './types/beartrap-shuffled-cells';

export const sortBeartrapCellsRandomly = ({
  tiles,
  rate,
  cells,
  random,
}: BeartrapCells): BeartrapShuffledCells => ({
  tiles,
  rate,
  cells: sortBy(cells, () => random.rollFloat()),
});
