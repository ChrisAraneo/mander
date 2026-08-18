import { isSpikeTile, type Tile, TILE_AIR } from '@mander/model';
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

/**
 * Share of the spikes a structure planted that each level pulls back out,
 * level 1 first. Every later level keeps the lot.
 */
const REMOVED_SHARE: readonly number[] = Object.freeze([1, 0.8, 0.6, 0.3]);

interface Cell {
  row: number;
  column: number;
}

const removedShareFor = (levelNumber: number): number =>
  REMOVED_SHARE[levelNumber - 1] ?? NOTHING_REMOVED;

/**
 * Spike cells in row-major order. Sifting columns before building any object
 * keeps a whole-grid scan to one number array per row rather than one object
 * per cell.
 */
const spikeCells = (tiles: Tile[][]): Cell[] =>
  flatMap(tiles, (cells, row) =>
    map(
      filter(range(size(cells)), (column) => isSpikeTile(cells[column])),
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

/**
 * Draws the doomed spikes in seed order, so the same level thins the same way
 * however often it is dealt.
 */
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

/**
 * Thins the spikes the structures brought with them. Nothing is ever sown:
 * the early levels only hand back a gentler cut of what was already there.
 */
export const clearSpikes = (tiles: Tile[][], levelNumber: number): Tile[][] =>
  match(removedShareFor(levelNumber))
    .with(NOTHING_REMOVED, () => map(tiles, (row) => [...row]))
    .otherwise((share) => pullSpikes(tiles, levelNumber, share));
