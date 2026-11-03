import { type Random, takeRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import { filter, includes, some } from 'lodash-es';
import { SANDABLE_TILES } from '../consts';

export const takeRandomSandableTile = (
  tiles: Tile[][],
  random: Random,
): Tile | undefined =>
  takeRandom(
    filter(SANDABLE_TILES, (sandable) =>
      some(tiles, (row) => includes(row, sandable)),
    ),
    random,
  );
