import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_GEM,
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
import { addGems } from './add-gems';

const GEMS_PER_STRUCTURE = 5;

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

const gemsIn = (tiles: Tile[][]): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => tile === TILE_GEM,
      ),
    ),
  );

const fingerprint = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

describe('addGems', () => {
  it('should strew five gems over the structure when a level is built from them', () => {
    const strewn = addGems(flatGround());

    expect(size(gemsIn(strewn))).toBe(
      (WIDTH / STRUCTURE_WIDTH) * GEMS_PER_STRUCTURE,
    );
  });

  it('should share the gems out evenly when the level holds several structures', () => {
    const strewn = addGems(flatGround());
    const perStructure = countBy(gemsIn(strewn), ({ column }) =>
      Math.floor(column / STRUCTURE_WIDTH),
    );

    expect(values(perStructure)).toEqual(
      times(WIDTH / STRUCTURE_WIDTH, () => GEMS_PER_STRUCTURE),
    );
  });

  it('should rest the gem two blocks over the ground when it sits above one', () => {
    const strewn = addGems(flatGround());
    const gems = gemsIn(strewn);

    expect(size(gems)).toBeGreaterThan(0);
    expect(
      every(
        gems,
        ({ row, column }) =>
          isSolidTile(strewn[row + REST_HEIGHT][column]) &&
          strewn[row + 1][column] === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('should leave a block of air over the gem when it lays one', () => {
    const strewn = addGems(flatGround());

    expect(
      every(
        gemsIn(strewn),
        ({ row, column }) => strewn[row - 1][column] === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('should never set two gems shoulder to shoulder when it strews them', () => {
    const columns = map(gemsIn(addGems(flatGround())), 'column');

    expect(
      filter(columns, (column) =>
        some(columns, (other) => other === column + 1),
      ),
    ).toEqual([]);
  });

  it('should perch no gem over the ground when it is a bed of spikes', () => {
    const tiles = flatGround();
    const teeth = [4, 5, 6, 7];
    forEach(teeth, (column) => {
      tiles[GROUND_ROW - 1][column] = TILE_SPIKE;
    });

    const strewn = addGems(tiles);

    expect(
      filter(gemsIn(strewn), ({ column }) => column >= 4 && column <= 7),
    ).toEqual([]);
  });

  it('should lay no gem when the ground leaves no room over its head', () => {
    const tiles = blank();
    tiles[1] = times(WIDTH, () => TILE_DIRT);

    expect(gemsIn(addGems(tiles))).toEqual([]);
  });

  it('should leave the ground it was given untouched when it strews gems', () => {
    const tiles = flatGround();
    const before = fingerprint(tiles);

    addGems(tiles);

    expect(fingerprint(tiles)).toBe(before);
  });

  it('should strew the ground the same way twice when it is given the same ground', () => {
    expect(fingerprint(addGems(flatGround()))).toBe(
      fingerprint(addGems(flatGround())),
    );
  });

  it('should hand every level its gems when a day is dealt', () => {
    const bare = filter(
      flatten(
        map(
          times(10, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
          (date) =>
            map(generate(date).levels, (level, index) => ({
              index,
              gems: size(gemsIn(level.tiles)),
            })),
        ),
      ),
      ({ gems }) => gems === 0,
    );

    expect(bare).toEqual([]);
  });
});
