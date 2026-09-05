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
import { tilesSeed } from './tiles-seed';

const NOTHING_REMOVED = 0;

const REMOVED_SHARE: readonly number[] = Object.freeze([0.5, 0.35, 0.2]);

interface Cell {
  row: number;
  column: number;
}

const removedShareFor = (levelNumber: number): number =>
  REMOVED_SHARE[levelNumber - 1] ?? NOTHING_REMOVED;

const beartrapCells = (tiles: Tile[][]): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => cells[column] === TILE_BEARTRAP),
      (column): Cell => ({ row, column }),
    ),
  );

const toAir = ({ row, column }: Cell): TilePatch => ({
  row,
  column,
  tile: TILE_AIR,
});

const seedOf = (tiles: Tile[][], levelNumber: number): string =>
  `beartrap#${levelNumber}#${tilesSeed(tiles)}`;

const springTraps = (
  tiles: Tile[][],
  levelNumber: number,
  share: number,
): Tile[][] =>
  chain(createRandom(seedOf(tiles, levelNumber)))
    .thru((random) => sortBy(beartrapCells(tiles), () => random.next()))
    .thru((shuffled) => take(shuffled, round(size(shuffled) * share)))
    .map(toAir)
    .thru((patches) => patchTiles(tiles, patches))
    .value();

export const clearBeartraps = (
  tiles: Tile[][],
  levelNumber: number,
): Tile[][] =>
  match(removedShareFor(levelNumber))
    .with(NOTHING_REMOVED, () => map(tiles, (row) => [...row]))
    .otherwise((share) => springTraps(tiles, levelNumber, share));
