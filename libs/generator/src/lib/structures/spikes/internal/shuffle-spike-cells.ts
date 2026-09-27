import type { Tile } from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import { sortBy } from 'lodash-es';
import { formatTilesSeed } from '../../format-tiles-seed';
import type { findSpikeCells } from './find-spike-cells';

const formatSeed = (tiles: Tile[][], levelNumber: number) =>
  `${levelNumber}#${formatTilesSeed(tiles)}`;

export const shuffleSpikeCells = ({
  tiles,
  levelNumber,
  rate,
  cells,
}: ReturnType<typeof findSpikeCells>) => ({
  tiles,
  rate,
  cells: chain(createRandom(formatSeed(tiles, levelNumber)))
    .thru((random) => sortBy(cells, () => random.rollFloat()))
    .value(),
});
