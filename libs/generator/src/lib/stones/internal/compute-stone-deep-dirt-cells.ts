import { TILE_DIRT } from '@mander/model';
import { map } from 'lodash-es';
import { computeDepths } from './compute-depths';
import { toFlag } from './to-flag';
import type { StoneDeepDirtCells } from './types/stone-deep-dirt-cells';
import type { StoneDirtDepth } from './types/stone-dirt-depth';

export const computeStoneDeepDirtCells = ({
  tiles,
  depth,
}: StoneDirtDepth): StoneDeepDirtCells => ({
  tiles,
  cells: map(computeDepths(tiles), (depths, row) =>
    map(depths, (tileDepth, column) =>
      toFlag(tiles[row][column] === TILE_DIRT && tileDepth >= depth),
    ),
  ),
});
