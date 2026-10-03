import { TILE_DIRT } from '@mander/model';
import { map } from 'lodash-es';
import { computeDepths } from './compute-depths';
import type { pickRandomDirtDepth } from './pick-random-dirt-depth';
import { toFlag } from './to-flag';

export const findDeepDirt = ({
  tiles,
  depth,
}: ReturnType<typeof pickRandomDirtDepth>) => ({
  tiles,
  cells: map(computeDepths(tiles), (depths, row) =>
    map(depths, (tileDepth, column) =>
      toFlag(tiles[row][column] === TILE_DIRT && tileDepth >= depth),
    ),
  ),
});
