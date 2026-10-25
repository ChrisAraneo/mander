import type {} from '@mander/engine';
import { sortBy } from 'lodash-es';
import type { SpikeCells } from './types/spike-cells';
import type { SpikeShuffledCells } from './types/spike-shuffled-cells';

export const sortSpikeCellsRandomly = ({
  tiles,
  rate,
  cells,
  random,
}: SpikeCells): SpikeShuffledCells => ({
  tiles,
  rate,
  cells: sortBy(cells, () => random()),
});
