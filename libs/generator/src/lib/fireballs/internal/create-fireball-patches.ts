import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { filterFireballCells } from './filter-fireball-cells';

export const createFireballPatches = ({
  tiles,
  cells,
}: ReturnType<typeof filterFireballCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
