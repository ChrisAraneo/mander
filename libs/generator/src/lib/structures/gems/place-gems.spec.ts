import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_SPIKE,
} from '@mander/model';
import { STRUCTURE_WIDTH, VERTICAL_BAND_HEIGHT } from '@mander/structures';
import {
  countBy,
  every,
  filter,
  flatMap,
  flatten,
  forEach,
  includes,
  join,
  map,
  size,
  some,
  times,
  values,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GEM_REST_HEIGHT, GEMS_PER_STRUCTURE } from '../../consts';
import { generate } from '../../generate';
import { placeGems } from './place-gems';

const WIDTH = STRUCTURE_WIDTH * 5;
const HEIGHT = 14;

const GROUND_ROW = HEIGHT - 1;

const CLIMB_WIDTH = 5;

const FLOOR_ROWS = [4, 8, 12, 16, 20];

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

const stackedFloors = (floorRows: number[]): Tile[][] =>
  times(VERTICAL_BAND_HEIGHT, (row) =>
    times(CLIMB_WIDTH, (): Tile =>
      includes(floorRows, row) ? TILE_DIRT : TILE_AIR,
    ),
  );

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

const gemsIn = (tiles: Tile[][]): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => tile === TILE_GEM,
      ),
    ),
  );

const isResting = (tiles: Tile[][], { row, column }: Cell): boolean =>
  isSolidTile(tiles[row + GEM_REST_HEIGHT][column]) &&
  tiles[row + 1][column] === TILE_AIR;

const fingerprint = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

describe('placeGems', () => {
  it('should strew five gems over each structure of a horizontal level when the ground is flat', () => {
    const strewn = placeGems(flatGround(), 'HORIZONTAL');

    expect(size(gemsIn(strewn))).toBe(
      (WIDTH / STRUCTURE_WIDTH) * GEMS_PER_STRUCTURE,
    );
  });

  it('should share the gems out evenly in a horizontal level when it holds several structures', () => {
    const strewn = placeGems(flatGround(), 'HORIZONTAL');
    const perStructure = countBy(gemsIn(strewn), ({ column }) =>
      Math.floor(column / STRUCTURE_WIDTH),
    );

    expect(values(perStructure)).toEqual(
      times(WIDTH / STRUCTURE_WIDTH, () => GEMS_PER_STRUCTURE),
    );
  });

  it('should rest the gem two blocks over the ground in a horizontal level when it sits above one', () => {
    const strewn = placeGems(flatGround(), 'HORIZONTAL');
    const gems = gemsIn(strewn);

    expect(size(gems)).toBeGreaterThan(0);
    expect(every(gems, (gem) => isResting(strewn, gem))).toBe(true);
  });

  it('should leave a block of air over the gem in a horizontal level when it lays one', () => {
    const strewn = placeGems(flatGround(), 'HORIZONTAL');

    expect(
      every(
        gemsIn(strewn),
        ({ row, column }) => strewn[row - 1][column] === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('should never set two gems shoulder to shoulder in a horizontal level when it strews them', () => {
    const columns = map(
      gemsIn(placeGems(flatGround(), 'HORIZONTAL')),
      'column',
    );

    expect(
      filter(columns, (column) =>
        some(columns, (other) => other === column + 1),
      ),
    ).toEqual([]);
  });

  it('should perch no gem over the ground in a horizontal level when it is a bed of spikes', () => {
    const tiles = flatGround();
    const teeth = [4, 5, 6, 7];
    forEach(teeth, (column) => {
      tiles[GROUND_ROW - 1][column] = TILE_SPIKE;
    });

    const strewn = placeGems(tiles, 'HORIZONTAL');

    expect(
      filter(gemsIn(strewn), ({ column }) => column >= 4 && column <= 7),
    ).toEqual([]);
  });

  it('should lay no gem in a horizontal level when the ground leaves no room over its head', () => {
    const tiles = blank();
    tiles[1] = times(WIDTH, () => TILE_DIRT);

    expect(gemsIn(placeGems(tiles, 'HORIZONTAL'))).toEqual([]);
  });

  it('should strew one gem over each floor of a vertical level when every fifth of it has a floor', () => {
    expect(
      map(gemsIn(placeGems(stackedFloors(FLOOR_ROWS), 'VERTICAL')), 'row'),
    ).toEqual(map(FLOOR_ROWS, (row) => row - GEM_REST_HEIGHT));
  });

  it('should rest the gem two blocks over the floor in a vertical level when it sits above one', () => {
    const strewn = placeGems(stackedFloors(FLOOR_ROWS), 'VERTICAL');
    const gems = gemsIn(strewn);

    expect(size(gems)).toBe(GEMS_PER_STRUCTURE);
    expect(every(gems, (gem) => isResting(strewn, gem))).toBe(true);
  });

  it('should never set two gems touching in a vertical level when two floors meet at a corner', () => {
    expect(
      placeGems(createGrid(['..', '..', '..', '..', '#.', '##']), 'VERTICAL'),
    ).toEqual(createGrid(['..', '..', 'o.', '..', '#.', '##']));
  });

  it('should lay no gem in a vertical level when no floor leaves room over its head', () => {
    expect(
      gemsIn(placeGems(stackedFloors([0, 3, 6, 9, 12, 15, 18]), 'VERTICAL')),
    ).toEqual([]);
  });

  it('should give back an empty horizontal level when it gets one', () => {
    expect(placeGems([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give back an empty vertical level when it gets one', () => {
    expect(placeGems([], 'VERTICAL')).toEqual([]);
  });

  it('should leave the ground it was given untouched when it strews gems', () => {
    const tiles = flatGround();
    const before = fingerprint(tiles);

    placeGems(tiles, 'HORIZONTAL');

    expect(fingerprint(tiles)).toBe(before);
  });

  it('should strew the ground the same way twice when it is given the same ground', () => {
    expect(fingerprint(placeGems(flatGround(), 'HORIZONTAL'))).toBe(
      fingerprint(placeGems(flatGround(), 'HORIZONTAL')),
    );
  });

  it('should strew a vertical level the same way twice when it is given the same floors', () => {
    expect(fingerprint(placeGems(stackedFloors(FLOOR_ROWS), 'VERTICAL'))).toBe(
      fingerprint(placeGems(stackedFloors(FLOOR_ROWS), 'VERTICAL')),
    );
  });

  it('should hand every level its gems when a day is dealt', () => {
    const bare = filter(
      flatMap(
        times(10, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
        (date) =>
          map(generate(date).levels, (level, index) => ({
            index,
            gems: size(gemsIn(level.tiles)),
          })),
      ),
      ({ gems }) => gems === 0,
    );

    expect(bare).toEqual([]);
  });
});
