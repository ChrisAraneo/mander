import { chain, createRandom } from '@mander/utils';
import { sortBy } from 'lodash-es';
import type { findSpikeCells } from './find-spike-cells';
import { formatSpikeSeed } from './format-spike-seed';

export const shuffleSpikeCells = ({
  tiles,
  levelNumber,
  rate,
  cells,
}: ReturnType<typeof findSpikeCells>) => ({
  tiles,
  rate,
  cells: chain(createRandom(formatSpikeSeed(tiles, levelNumber)))
    .thru((random) => sortBy(cells, () => random.rollFloat()))
    .value(),
});
