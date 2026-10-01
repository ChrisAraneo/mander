import { TILE_DIRT } from '@mander/model';
import { map } from 'lodash-es';
import { convertToFlag } from './convert-to-flag';
import { measureDepths } from './measure-depths';
import type { pickRandomDirtDepth } from './pick-random-dirt-depth';

export const findDeepDirt = ({
  tiles,
  depth,
}: ReturnType<typeof pickRandomDirtDepth>) => ({
  tiles,
  cells: map(measureDepths(tiles), (depths, row) =>
    map(depths, (tileDepth, column) =>
      convertToFlag(tiles[row][column] === TILE_DIRT && tileDepth >= depth),
    ),
  ),
});
