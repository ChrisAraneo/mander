import { round, size, take } from 'lodash-es';
import type { SpikeShuffledCells } from './types/spike-shuffled-cells';
import type { SpikeSlice } from './types/spike-slice';

export const sliceSpikeCells = ({
  tiles,
  rate,
  cells,
}: SpikeShuffledCells): SpikeSlice => ({
  tiles,
  cells: take(cells, round(size(cells) * rate)),
});
