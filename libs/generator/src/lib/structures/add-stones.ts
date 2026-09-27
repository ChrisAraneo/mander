import { isSolidTile, type Tile, TILE_DIRT, TILE_STONE } from '@mander/model';
import { chain, createRandom } from '@mander/utils';
import { map, range, reduce, size, sum, times } from 'lodash-es';
import { match } from 'ts-pattern';

import { formatTilesSeed } from './format-tiles-seed';

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

const convertToFlag = (isOn: boolean): number => Number(isOn);

const measureDepths = (tiles: Tile[][]): Field =>
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

const findBuried = (tiles: Tile[][], dirtDepth: number): Field =>
  map(measureDepths(tiles), (depths, row) =>
    map(depths, (depth, column) =>
      convertToFlag(tiles[row][column] === TILE_DIRT && depth >= dirtDepth),
    ),
  );

const clampIndex = (index: number, edge: number): number =>
  Math.min(Math.max(index, 0), edge);

const sumTaps = (sampleAt: (tap: number) => number): number => {
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
          sumTaps((tap) => cells[clampIndex(column + tap - BLUR_REACH, edge)]),
        ),
      )
      .value(),
  );

const blurColumns = (field: Field): Field =>
  chain(size(field) - 1)
    .thru((edge) =>
      map(field, (cells, row) =>
        chain(map(BLUR_SPAN, (offset) => field[clampIndex(row + offset, edge)]))
          .thru((rows) =>
            times(size(cells), (column) => sumTaps((tap) => rows[tap][column])),
          )
          .value(),
      ),
    )
    .value();

const blur = (field: Field): Field => blurColumns(blurRows(field));

const soften = (field: Field): Field =>
  reduce(times(BLUR_PASSES), (softened: Field) => blur(softened), field);

const sharpen = (field: Field): Field =>
  map(field, (cells) =>
    map(cells, (share) => convertToFlag(share >= STONE_SHARE)),
  );

const multiplyFields = (field: Field, other: Field): Field =>
  map(field, (cells, row) =>
    map(cells, (share, column) => share * other[row][column]),
  );

const roundOff = (buried: Field): Field =>
  reduce(
    times(BLOB_ROUNDS),
    (blobs: Field) => multiplyFields(sharpen(blur(blobs)), buried),
    multiplyFields(sharpen(soften(buried)), buried),
  );

const countCompany = (blobs: Field, row: number, column: number): number =>
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
          convertToFlag(
            stone === 1 && countCompany(kept, row, column) >= STONE_COMPANY,
          ),
        ),
      ),
    blobs,
  );

export const addStones = (tiles: Tile[][]): Tile[][] =>
  chain(createRandom(formatTilesSeed(tiles)))
    .thru((random) =>
      match(random.isRollUnder(DEEP_DIRT_CHANCE))
        .with(true, () => DEEP_DIRT_DEPTH)
        .otherwise(() => DIRT_DEPTH),
    )
    .thru((dirtDepth) => shed(roundOff(findBuried(tiles, dirtDepth))))
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
