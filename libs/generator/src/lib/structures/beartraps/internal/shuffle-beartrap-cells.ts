import { chain, createRandom } from '@mander/utils';
import { sortBy } from 'lodash-es';
import type { findBeartrapCells } from './find-beartrap-cells';
import { formatBeartrapSeed } from './format-beartrap-seed';

export const shuffleBeartrapCells = ({
  tiles,
  levelNumber,
  rate,
  cells,
}: ReturnType<typeof findBeartrapCells>) => ({
  tiles,
  rate,
  cells: chain(createRandom(formatBeartrapSeed(tiles, levelNumber)))
    .thru((random) => sortBy(cells, () => random.rollFloat()))
    .value(),
});
