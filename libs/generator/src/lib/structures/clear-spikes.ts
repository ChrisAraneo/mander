import {
  isSpikeTile,
  type Tile,
  TILE_AIR,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import {
  filter,
  flatMap,
  join,
  map,
  range,
  round,
  size,
  sortBy,
  take,
} from 'lodash-es';
import { match } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';

const NOTHING_REMOVED = 0;

const REMOVED_SHARE: readonly number[] = Object.freeze([1, 0.8, 0.6, 0.3]);

interface Cell {
  row: number;
  column: number;
}

const removedShareFor = (levelNumber: number): number =>
  REMOVED_SHARE[levelNumber - 1] ?? NOTHING_REMOVED;

const isThinnable = (tile: Tile): boolean =>
  isSpikeTile(tile) || tile === TILE_SPIKE_FALLING;

const spikeCells = (tiles: Tile[][]): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => isThinnable(cells[column])),
      (column): Cell => ({ row, column }),
    ),
  );

const toAir = ({ row, column }: Cell): TilePatch => ({
  row,
  column,
  tile: TILE_AIR,
});

const seedOf = (tiles: Tile[][], levelNumber: number): string =>
  `${levelNumber}#${join(
    map(tiles, (row) => join(row, ',')),
    '|',
  )}`;

const pullSpikes = (
  tiles: Tile[][],
  levelNumber: number,
  share: number,
): Tile[][] =>
  chain(createRandom(seedOf(tiles, levelNumber)))
    .thru((random) => sortBy(spikeCells(tiles), () => random.next()))
    .thru((shuffled) => take(shuffled, round(size(shuffled) * share)))
    .map(toAir)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

export const clearSpikes = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  match(removedShareFor(levelNumber))
    .with(NOTHING_REMOVED, () => map(tiles, (row) => [...row]))
    .otherwise((share) => pullSpikes(tiles, levelNumber, share));
