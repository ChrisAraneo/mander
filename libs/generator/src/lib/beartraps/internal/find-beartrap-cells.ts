import { TILE_BEARTRAP } from '@mander/model';
import { filter, flatMap, map, range, size } from 'lodash-es';
import type { getBeartrapRemovalRate } from './get-beartrap-removal-rate';

export const findBeartrapCells = ({
  tiles,
  random,
  rate,
}: ReturnType<typeof getBeartrapRemovalRate>) => ({
  tiles,
  random,
  rate,
  cells: flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => cells[column] === TILE_BEARTRAP),
      (column) => ({ row, column }),
    ),
  ),
});
