import { filter, flatMap, map, range, size } from 'lodash-es';
import type { getSpikeRemovalRate } from './get-spike-removal-rate';
import { isClearableSpikeTile } from './is-clearable-spike-tile';

export const filterSpikeCells = ({
  tiles,
  rate,
  random,
}: ReturnType<typeof getSpikeRemovalRate>) => ({
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
