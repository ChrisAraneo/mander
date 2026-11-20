import { type Random, tryTakeRandom } from '@mander/common';
import type { Tile } from '@mander/model';
import { filter, includes, some } from 'lodash-es';
import { SANDABLE_TILES } from '../consts';

export const takeRandomSandableTile = (
  tiles: Tile[][],
  random: Random,
): Tile | undefined =>
  tryTakeRandom(
    filter(SANDABLE_TILES, (sandable) =>
      some(tiles, (row) => includes(row, sandable)),
    ),
    random,
  );
