import { map } from 'lodash-es';
import { borrowNeighbourTile } from './borrow-neighbour-tile';
import type { findFireballCells } from './find-fireball-cells';

export const createFireballPatches = ({
  tiles,
  cells,
}: ReturnType<typeof findFireballCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: borrowNeighbourTile(tiles, row, column),
  })),
});
