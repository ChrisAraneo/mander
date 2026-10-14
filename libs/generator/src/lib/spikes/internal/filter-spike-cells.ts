import { filter, flatMap, map, range, size } from 'lodash-es';
import { isClearableSpikeTile } from './is-clearable-spike-tile';
import type { SpikeCells } from './types/spike-cells';
import type { SpikeRemovalRate } from './types/spike-removal-rate';

export const filterSpikeCells = ({
  tiles,
  rate,
  random,
}: SpikeRemovalRate): SpikeCells => ({
  tiles,
  rate,
  cells: flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) =>
        isClearableSpikeTile(cells[column]),
      ),
      (column) => ({ row, column }),
    ),
  ),
  random,
});
