import { isSolidTile, type Tile, TILE_AIR, TILE_GEM } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { chain, createRandom } from '@mander/utils';
import {
  ceil,
  every,
  filter,
  findIndex,
  floor,
  map,
  range,
  reduce,
  size,
  sortBy,
} from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchTiles, type TilePatch } from './patch-tiles';
import { formatTilesSeed } from './format-tiles-seed';

const { nullish } = P;

const GEMS_PER_STRUCTURE = 5;

const SLOT_WIDTH = STRUCTURE_WIDTH / GEMS_PER_STRUCTURE;

const REST_HEIGHT = 2;

const AIR_ABOVE = 1;

const CLEARANCE = REST_HEIGHT + AIR_ABOVE;

const MIN_GAP = 2;

interface Sowing {
  taken: number[];
  patches: TilePatch[];
}

const findSurfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const isFree = (tiles: Tile[][], column: number): boolean =>
  chain(findSurfaceRow(tiles, column))
    .thru(
      (surface) =>
        surface >= CLEARANCE &&
        every(
          range(1, CLEARANCE + 1),
          (offset) => tiles[surface - offset][column] === TILE_AIR,
        ),
    )
    .value();

const isApart = (taken: number[], column: number): boolean =>
  every(taken, (other) => Math.abs(other - column) >= MIN_GAP);

const getSlotColumns = (width: number, band: number, slot: number): number[] =>
  filter(
    range(
      band * STRUCTURE_WIDTH + slot * SLOT_WIDTH,
      band * STRUCTURE_WIDTH + (slot + 1) * SLOT_WIDTH,
    ),
    (column) => column < width,
  );

const listSlots = (width: number): number[][] =>
  map(range(ceil(width / STRUCTURE_WIDTH) * GEMS_PER_STRUCTURE), (index) =>
    getSlotColumns(
      width,
      floor(index / GEMS_PER_STRUCTURE),
      index % GEMS_PER_STRUCTURE,
    ),
  );

const sowSlot = (
  tiles: Tile[][],
  random: ReturnType<typeof createRandom>,
  sown: Sowing,
  columns: number[],
): Sowing =>
  chain(sortBy(columns, () => random.rollFloat()))
    .find(
      (candidate) => isFree(tiles, candidate) && isApart(sown.taken, candidate),
    )
    .thru((column) =>
      match(column)
        .with(nullish, () => sown)
        .otherwise((found): Sowing => ({
          taken: [...sown.taken, found],
          patches: [
            ...sown.patches,
            {
              row: findSurfaceRow(tiles, found) - REST_HEIGHT,
              column: found,
              tile: TILE_GEM,
            },
          ],
        })),
    )
    .value();

export const addGems = (tiles: Tile[][]): Tile[][] =>
  chain(createRandom(formatTilesSeed(tiles)))
    .thru((random) =>
      reduce(
        listSlots(size(tiles[0] ?? [])),
        (sown: Sowing, columns): Sowing =>
          sowSlot(tiles, random, sown, columns),
        { taken: [], patches: [] },
      ),
    )
    .thru(({ patches }) => patchTiles(tiles, patches))
    .value();
