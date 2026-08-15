import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_DIAMOND,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import {
  countBy,
  every,
  filter,
  flatten,
  forEach,
  join,
  map,
  size,
  some,
  times,
  values,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from '../generate';
import { addDiamonds } from './add-diamonds';

const DIAMONDS_PER_STRUCTURE = 5;

const REST_HEIGHT = 2;

const WIDTH = STRUCTURE_WIDTH * 5;
const HEIGHT = 14;

const GROUND_ROW = HEIGHT - 1;

interface Cell {
  row: number;
  column: number;
}

const blank = (): Tile[][] =>
  times(HEIGHT, () => times(WIDTH, (): Tile => TILE_AIR));

const flatGround = (): Tile[][] => {
  const tiles = blank();
  tiles[GROUND_ROW] = times(WIDTH, () => TILE_DIRT);

  return tiles;
};

const diamondsIn = (tiles: Tile[][]): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => tile === TILE_DIAMOND,
      ),
    ),
  );

const fingerprint = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

describe('addDiamonds', () => {
  it('strews five diamonds over every structure the level is built from', () => {
    const strewn = addDiamonds(flatGround());

    expect(size(diamondsIn(strewn))).toBe(
      (WIDTH / STRUCTURE_WIDTH) * DIAMONDS_PER_STRUCTURE,
    );
  });

  it('shares them out evenly, structure by structure', () => {
    const strewn = addDiamonds(flatGround());
    const perStructure = countBy(diamondsIn(strewn), ({ column }) =>
      Math.floor(column / STRUCTURE_WIDTH),
    );

    expect(values(perStructure)).toEqual(
      times(WIDTH / STRUCTURE_WIDTH, () => DIAMONDS_PER_STRUCTURE),
    );
  });

  it('rests each one two blocks over the ground it sits above', () => {
    const strewn = addDiamonds(flatGround());
    const diamonds = diamondsIn(strewn);

    expect(size(diamonds)).toBeGreaterThan(0);
    expect(
      every(
        diamonds,
        ({ row, column }) =>
          isSolidTile(strewn[row + REST_HEIGHT][column]) &&
          strewn[row + 1][column] === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('leaves a block of air over every one of them', () => {
    const strewn = addDiamonds(flatGround());

    expect(
      every(
        diamondsIn(strewn),
        ({ row, column }) => strewn[row - 1][column] === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('never sets two of them shoulder to shoulder', () => {
    const columns = map(diamondsIn(addDiamonds(flatGround())), 'column');

    expect(
      filter(columns, (column) =>
        some(columns, (other) => other === column + 1),
      ),
    ).toEqual([]);
  });

  it('perches none of them over a bed of spikes', () => {
    const tiles = flatGround();
    const teeth = [4, 5, 6, 7];
    forEach(teeth, (column) => {
      tiles[GROUND_ROW - 1][column] = TILE_SPIKE;
    });

    const strewn = addDiamonds(tiles);

    expect(
      filter(diamondsIn(strewn), ({ column }) => column >= 4 && column <= 7),
    ).toEqual([]);
  });

  it('lays none where the ground leaves no room over its head', () => {
    const tiles = blank();
    tiles[1] = times(WIDTH, () => TILE_DIRT);

    expect(diamondsIn(addDiamonds(tiles))).toEqual([]);
  });

  it('leaves the ground it was given untouched', () => {
    const tiles = flatGround();
    const before = fingerprint(tiles);

    addDiamonds(tiles);

    expect(fingerprint(tiles)).toBe(before);
  });

  it('strews the same ground the same way twice', () => {
    expect(fingerprint(addDiamonds(flatGround()))).toBe(
      fingerprint(addDiamonds(flatGround())),
    );
  });

  it('hands every level of a dealt day its diamonds', () => {
    const bare = filter(
      flatten(
        map(
          times(10, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
          (date) =>
            map(generate(date).levels, (level, index) => ({
              index,
              diamonds: size(diamondsIn(level.tiles)),
            })),
        ),
      ),
      ({ diamonds }) => diamonds === 0,
    );

    expect(bare).toEqual([]);
  });
});
