import { TILE_DIRT } from '@mander/model';
import { map } from 'lodash-es';
import { computeDepths } from './compute-depths';
import type { takeRandomDirtDepth } from './take-random-dirt-depth';
import { toFlag } from './to-flag';

export const computeDeepDirtCells = ({
  tiles,
  depth,
}: ReturnType<typeof takeRandomDirtDepth>) => ({
  tiles,
  cells: map(computeDepths(tiles), (depths, row) =>
    map(depths, (tileDepth, column) =>
      toFlag(tiles[row][column] === TILE_DIRT && tileDepth >= depth),
    ),
  ),
});
