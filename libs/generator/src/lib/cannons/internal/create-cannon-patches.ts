import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { filterCannonCells } from './filter-cannon-cells';

export const createCannonPatches = ({
  tiles,
  cells,
}: ReturnType<typeof filterCannonCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
