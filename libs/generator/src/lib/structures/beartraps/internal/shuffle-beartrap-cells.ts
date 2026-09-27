import type { Tile } from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import { sortBy } from 'lodash-es';
import { formatTilesSeed } from '../../format-tiles-seed';
import type { findBeartrapCells } from './find-beartrap-cells';

const formatSeed = (tiles: Tile[][], levelNumber: number) =>
  `beartrap#${levelNumber}#${formatTilesSeed(tiles)}`;

export const shuffleBeartrapCells = ({
  tiles,
  levelNumber,
  rate,
  cells,
}: ReturnType<typeof findBeartrapCells>) => ({
  tiles,
  rate,
  cells: chain(createRandom(formatSeed(tiles, levelNumber)))
    .thru((random) => sortBy(cells, () => random.rollFloat()))
    .value(),
});
