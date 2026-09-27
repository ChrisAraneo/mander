import { type Tile, TILE_AIR, TILE_BEARTRAP } from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import {
  filter,
  flatMap,
  map,
  range,
  round,
  size,
  sortBy,
  take,
} from 'lodash-es';
import { match } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { formatTilesSeed } from './format-tiles-seed';

const NOTHING_REMOVED = 0;

const REMOVED_SHARE: readonly number[] = Object.freeze([0.5, 0.35, 0.2]);

interface Cell {
  row: number;
  column: number;
}

const getRemovedShare = (levelNumber: number): number =>
  REMOVED_SHARE[levelNumber - 1] ?? NOTHING_REMOVED;

const findBeartrapCells = (tiles: Tile[][]): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => cells[column] === TILE_BEARTRAP),
      (column): Cell => ({ row, column }),
    ),
  );

const createAirPatch = ({ row, column }: Cell): TilePatch => ({
  row,
  column,
  tile: TILE_AIR,
});

const formatSeed = (tiles: Tile[][], levelNumber: number): string =>
  `beartrap#${levelNumber}#${formatTilesSeed(tiles)}`;

const springTraps = (
  tiles: Tile[][],
  levelNumber: number,
  share: number,
): Tile[][] =>
  chain(createRandom(formatSeed(tiles, levelNumber)))
    .thru((random) =>
      sortBy(findBeartrapCells(tiles), () => random.rollFloat()),
    )
    .thru((shuffled) => take(shuffled, round(size(shuffled) * share)))
    .map(createAirPatch)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

export const clearBeartraps = (
  tiles: Tile[][],
  levelNumber: number,
): Tile[][] =>
  match(getRemovedShare(levelNumber))
    .with(NOTHING_REMOVED, () => map(tiles, (row) => [...row]))
    .otherwise((share) => springTraps(tiles, levelNumber, share));
