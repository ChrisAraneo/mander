import { isSolidTile, type Tile, TILE_AIR, TILE_DIAMOND } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { createRandom } from '@mander/utils';
import {
  ceil,
  every,
  filter,
  find,
  findIndex,
  floor,
  forEach,
  join,
  map,
  range,
  size,
  sortBy,
} from 'lodash-es';

const DIAMONDS_PER_STRUCTURE = 5;

const SLOT_WIDTH = STRUCTURE_WIDTH / DIAMONDS_PER_STRUCTURE;

const REST_HEIGHT = 2;

const AIR_ABOVE = 1;

const CLEARANCE = REST_HEIGHT + AIR_ABOVE;

const MIN_GAP = 2;

const seedOf = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (row) => isSolidTile(row[column]));

const isFree = (tiles: Tile[][], column: number): boolean => {
  const surface = surfaceRow(tiles, column);

  return (
    surface >= CLEARANCE &&
    every(
      range(1, CLEARANCE + 1),
      (offset) => tiles[surface - offset][column] === TILE_AIR,
    )
  );
};

const isApart = (taken: number[], column: number): boolean =>
  every(taken, (other) => Math.abs(other - column) >= MIN_GAP);

const slotColumns = (width: number, band: number, slot: number): number[] =>
  filter(
    range(
      band * STRUCTURE_WIDTH + slot * SLOT_WIDTH,
      band * STRUCTURE_WIDTH + (slot + 1) * SLOT_WIDTH,
    ),
    (column) => column < width,
  );

const slots = (width: number): number[][] =>
  map(range(ceil(width / STRUCTURE_WIDTH) * DIAMONDS_PER_STRUCTURE), (index) =>
    slotColumns(
      width,
      floor(index / DIAMONDS_PER_STRUCTURE),
      index % DIAMONDS_PER_STRUCTURE,
    ),
  );

export const addDiamonds = (tiles: Tile[][]): Tile[][] => {
  const strewn = map(tiles, (row) => [...row]);
  const width = size(strewn[0] ?? []);
  const random = createRandom(seedOf(tiles));
  const taken: number[] = [];

  forEach(slots(width), (columns) => {
    const column = find(
      sortBy(columns, () => random.next()),
      (candidate) => isFree(strewn, candidate) && isApart(taken, candidate),
    );

    if (column === undefined) return;

    strewn[surfaceRow(strewn, column) - REST_HEIGHT][column] = TILE_DIAMOND;
    taken.push(column);
  });

  return strewn;
};
