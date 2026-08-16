import { isSolidTile, type Tile, TILE_DIRT, TILE_STONE } from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import { join, map, range, reduce, size, sum, times } from 'lodash-es';
import { match } from 'ts-pattern';

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

/** 1 or 0 without branching — this runs once per cell of every blur pass. */
const toFlag = (on: boolean): number => Number(on);

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
        match(isSolidTile(tile))
          .with(true, () => (depths[row - 1]?.[column] ?? UNBURIED) + 1)
          .otherwise(() => UNBURIED),
      ),
    ],
    [],
  );

const buriedOf = (tiles: Tile[][], dirtDepth: number): Field =>
  map(depthsOf(tiles), (depths, row) =>
    map(depths, (depth, column) =>
      toFlag(tiles[row][column] === TILE_DIRT && depth >= dirtDepth),
    ),
  );

const nearest = (index: number, edge: number): number =>
  Math.min(Math.max(index, 0), edge);

/**
 * The one hand-rolled loop left in this package, and a deliberate one.
 *
 * The blur runs ten kernel passes per level over every cell, so this
 * accumulator is entered ~16 million times to generate a single world. Every
 * pipeline form of it — `reduce` over the taps, `sum(map(...))`, or a
 * tap-major convolution — costs one closure call per tap and measured 2.8x
 * slower end to end (93ms -> 263ms per world), which lands on the start
 * screen while the backdrop world is generated. Keep the loop; keep every
 * caller around it a pipeline.
 */
const tapTotal = (sampleAt: (tap: number) => number): number => {
  let total = 0;

  for (let tap = 0; tap < BLUR_TAPS.length; tap++) {
    total += BLUR_TAPS[tap] * sampleAt(tap);
  }

  return total / BLUR_WEIGHT;
};

const blurRows = (field: Field): Field =>
  map(field, (cells) =>
    chain(size(cells) - 1)
      .thru((edge) =>
        times(size(cells), (column) =>
          tapTotal((tap) => cells[nearest(column + tap - BLUR_REACH, edge)]),
        ),
      )
      .value(),
  );

const blurColumns = (field: Field): Field =>
  chain(size(field) - 1)
    .thru((edge) =>
      map(field, (cells, row) =>
        chain(map(BLUR_SPAN, (offset) => field[nearest(row + offset, edge)]))
          .thru((rows) =>
            times(size(cells), (column) =>
              tapTotal((tap) => rows[tap][column]),
            ),
          )
          .value(),
      ),
    )
    .value();

const blur = (field: Field): Field => blurColumns(blurRows(field));

const soften = (field: Field): Field =>
  reduce(times(BLUR_PASSES), (softened: Field) => blur(softened), field);

const sharpen = (field: Field): Field =>
  map(field, (cells) => map(cells, (share) => toFlag(share >= STONE_SHARE)));

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
          toFlag(stone === 1 && company(kept, row, column) >= STONE_COMPANY),
        ),
      ),
    blobs,
  );

export const addStones = (tiles: Tile[][]): Tile[][] =>
  chain(createRandom(seedOf(tiles)))
    .thru((random) =>
      match(random.chance(DEEP_DIRT_CHANCE))
        .with(true, () => DEEP_DIRT_DEPTH)
        .otherwise(() => DIRT_DEPTH),
    )
    .thru((dirtDepth) => shed(roundOff(buriedOf(tiles, dirtDepth))))
    .thru((stones) =>
      map(tiles, (cells, row) =>
        map(cells, (tile, column) =>
          match(stones[row][column])
            .with(1, () => TILE_STONE)
            .otherwise(() => tile),
        ),
      ),
    )
    .value();
