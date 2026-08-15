import { isSolidTile, type Tile, TILE_DIRT, TILE_STONE } from '@mander/model';
import { createRandom } from '@mander/utils';
import { join, map, range, reduce, size, sum, times } from 'lodash-es';

const DIRT_DEPTH = 3;

const DEEP_DIRT_DEPTH = 4;

const DEEP_DIRT_CHANCE = 0.5;

const BLUR_WEIGHTS = [12, 11, 10, 9, 8, 6, 4, 3, 2];

const BLUR_REACH = size(BLUR_WEIGHTS) - 1;

const BLUR_SPAN = range(-BLUR_REACH, BLUR_REACH + 1);

const BLUR_TAPS = map(BLUR_SPAN, (offset) => BLUR_WEIGHTS[Math.abs(offset)]);

const BLUR_WEIGHT = sum(BLUR_TAPS);

const BLUR_PASSES = 2;

const BLOB_ROUNDS = 2;

const SHED_ROUNDS = 2;

const STONE_COMPANY = 2;

const STONE_SHARE = 0.5;

const UNBURIED = -1;

type Field = number[][];

const seedOf = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

const depthsOf = (tiles: Tile[][]): Field =>
  reduce(
    tiles,
    (depths: Field, cells, row): Field => [
      ...depths,
      map(cells, (tile, column) =>
        isSolidTile(tile)
          ? (depths[row - 1]?.[column] ?? UNBURIED) + 1
          : UNBURIED,
      ),
    ],
    [],
  );

const buriedOf = (tiles: Tile[][], dirtDepth: number): Field =>
  map(depthsOf(tiles), (depths, row) =>
    map(depths, (depth, column) =>
      tiles[row][column] === TILE_DIRT && depth >= dirtDepth ? 1 : 0,
    ),
  );

const nearest = (index: number, edge: number): number =>
  Math.min(Math.max(index, 0), edge);

const blurRows = (field: Field): Field =>
  map(field, (cells) => {
    const edge = size(cells) - 1;

    return times(size(cells), (column) => {
      let total = 0;

      for (let tap = 0; tap < BLUR_TAPS.length; tap++) {
        total +=
          BLUR_TAPS[tap] * cells[nearest(column + tap - BLUR_REACH, edge)];
      }

      return total / BLUR_WEIGHT;
    });
  });

const blurColumns = (field: Field): Field => {
  const edge = size(field) - 1;

  return map(field, (cells, row) => {
    const rows = map(BLUR_SPAN, (offset) => field[nearest(row + offset, edge)]);

    return times(size(cells), (column) => {
      let total = 0;

      for (let tap = 0; tap < BLUR_TAPS.length; tap++) {
        total += BLUR_TAPS[tap] * rows[tap][column];
      }

      return total / BLUR_WEIGHT;
    });
  });
};

const blur = (field: Field): Field => blurColumns(blurRows(field));

const soften = (field: Field): Field =>
  reduce(times(BLUR_PASSES), (softened: Field) => blur(softened), field);

const sharpen = (field: Field): Field =>
  map(field, (cells) => map(cells, (share) => (share >= STONE_SHARE ? 1 : 0)));

const both = (field: Field, other: Field): Field =>
  map(field, (cells, row) =>
    map(cells, (share, column) => share * other[row][column]),
  );

const roundOff = (buried: Field): Field =>
  reduce(
    times(BLOB_ROUNDS),
    (blobs: Field) => both(sharpen(blur(blobs)), buried),
    both(sharpen(soften(buried)), buried),
  );

const company = (blobs: Field, row: number, column: number): number =>
  sum([
    blobs[row - 1]?.[column] ?? 0,
    blobs[row + 1]?.[column] ?? 0,
    blobs[row][column - 1] ?? 0,
    blobs[row][column + 1] ?? 0,
  ]);

const shed = (blobs: Field): Field =>
  reduce(
    times(SHED_ROUNDS),
    (kept: Field) =>
      map(kept, (cells, row) =>
        map(cells, (stone, column) =>
          stone === 1 && company(kept, row, column) >= STONE_COMPANY ? 1 : 0,
        ),
      ),
    blobs,
  );

export const addStones = (tiles: Tile[][]): Tile[][] => {
  const random = createRandom(seedOf(tiles));
  const dirtDepth = random.chance(DEEP_DIRT_CHANCE)
    ? DEEP_DIRT_DEPTH
    : DIRT_DEPTH;
  const stones = shed(roundOff(buriedOf(tiles, dirtDepth)));

  return map(tiles, (cells, row) =>
    map(cells, (tile, column) =>
      stones[row][column] === 1 ? TILE_STONE : tile,
    ),
  );
};
