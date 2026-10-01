import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_SPIKE,
} from '@mander/model';
import { STRUCTURE_WIDTH, VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { createRandom } from '@mander/utils';
import {
  countBy,
  every,
  filter,
  flatMap,
  flatten,
  floor,
  includes,
  map,
  range,
  repeat,
  size,
  some,
  times,
  values,
} from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { GEM_REST_HEIGHT, GEMS_PER_STRUCTURE } from '../../consts';
import { generate } from '../../generate';
import { placeGems } from './place-gems';

interface Cell {
  row: number;
  column: number;
}

const SEED = 'DAY-1';

const WIDTH = STRUCTURE_WIDTH * 5;

const HEIGHT = 14;

const CLIMB_WIDTH = 5;

const FLOOR_ROWS = [4, 8, 12, 16, 20];

const SPIKED_COLUMNS = range(4, 8);

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  '^': TILE_SPIKE,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const createGround = (): Tile[][] =>
  createGrid([
    ...times(HEIGHT - 1, () => repeat('.', WIDTH)),
    repeat('#', WIDTH),
  ]);

const createSpikedGround = (): Tile[][] =>
  createGrid([
    ...times(HEIGHT - 2, () => repeat('.', WIDTH)),
    `${repeat('.', 4)}${repeat('^', 4)}${repeat('.', WIDTH - 8)}`,
    repeat('#', WIDTH),
  ]);

const createFloors = (floorRows: number[]): Tile[][] =>
  times(VERTICAL_BAND_HEIGHT, (row) =>
    times(CLIMB_WIDTH, (): Tile =>
      match(includes(floorRows, row))
        .with(true, () => TILE_DIRT)
        .otherwise(() => TILE_AIR),
    ),
  );

const findGems = (tiles: Tile[][]): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      map(
        filter(range(size(cells)), (column) => cells[column] === TILE_GEM),
        (column) => ({ row, column }),
      ),
    ),
  );

const isResting = (tiles: Tile[][], { row, column }: Cell): boolean =>
  isSolidTile(tiles[row + GEM_REST_HEIGHT][column]) &&
  tiles[row + 1][column] === TILE_AIR;

describe('placeGems', () => {
  it('should strew five gems over each structure of a horizontal level when the ground is flat', () => {
    const strewn = placeGems(createGround(), 'HORIZONTAL', createRandom(SEED));

    expect(size(findGems(strewn))).toBe(
      (WIDTH / STRUCTURE_WIDTH) * GEMS_PER_STRUCTURE,
    );
  });

  it('should share the gems out evenly in a horizontal level when it holds several structures', () => {
    const strewn = placeGems(createGround(), 'HORIZONTAL', createRandom(SEED));

    const perStructure = countBy(findGems(strewn), ({ column }) =>
      floor(column / STRUCTURE_WIDTH),
    );

    expect(values(perStructure)).toEqual(
      times(WIDTH / STRUCTURE_WIDTH, () => GEMS_PER_STRUCTURE),
    );
  });

  it('should rest the gem two blocks over the ground in a horizontal level when it sits above one', () => {
    const strewn = placeGems(createGround(), 'HORIZONTAL', createRandom(SEED));

    const gems = findGems(strewn);

    expect(size(gems)).toBeGreaterThan(0);
    expect(every(gems, (gem) => isResting(strewn, gem))).toBe(true);
  });

  it('should leave a block of air over the gem in a horizontal level when it lays one', () => {
    const strewn = placeGems(createGround(), 'HORIZONTAL', createRandom(SEED));

    expect(
      every(
        findGems(strewn),
        ({ row, column }) => strewn[row - 1][column] === TILE_AIR,
      ),
    ).toBe(true);
  });

  it('should never set two gems shoulder to shoulder in a horizontal level when it strews them', () => {
    const columns = map(
      findGems(placeGems(createGround(), 'HORIZONTAL', createRandom(SEED))),
      'column',
    );

    expect(
      filter(columns, (column) =>
        some(columns, (other) => other === column + 1),
      ),
    ).toEqual([]);
  });

  it('should perch no gem over the ground in a horizontal level when it is a bed of spikes', () => {
    const strewn = placeGems(
      createSpikedGround(),
      'HORIZONTAL',
      createRandom(SEED),
    );

    expect(
      filter(findGems(strewn), ({ column }) =>
        includes(SPIKED_COLUMNS, column),
      ),
    ).toEqual([]);
  });

  it('should lay no gem in a horizontal level when the ground leaves no room over its head', () => {
    const tiles = createGrid([
      repeat('.', WIDTH),
      ...times(HEIGHT - 1, () => repeat('#', WIDTH)),
    ]);

    expect(
      findGems(placeGems(tiles, 'HORIZONTAL', createRandom(SEED))),
    ).toEqual([]);
  });

  it('should strew one gem over each floor of a vertical level when every fifth of it has a floor', () => {
    expect(
      map(
        findGems(
          placeGems(createFloors(FLOOR_ROWS), 'VERTICAL', createRandom(SEED)),
        ),
        'row',
      ),
    ).toEqual(map(FLOOR_ROWS, (row) => row - GEM_REST_HEIGHT));
  });

  it('should rest the gem two blocks over the floor in a vertical level when it sits above one', () => {
    const strewn = placeGems(
      createFloors(FLOOR_ROWS),
      'VERTICAL',
      createRandom(SEED),
    );

    const gems = findGems(strewn);

    expect(size(gems)).toBe(GEMS_PER_STRUCTURE);
    expect(every(gems, (gem) => isResting(strewn, gem))).toBe(true);
  });

  it('should never set two gems touching in a vertical level when two floors meet at a corner', () => {
    expect(
      placeGems(
        createGrid(['..', '..', '..', '..', '#.', '##']),
        'VERTICAL',
        createRandom(SEED),
      ),
    ).toEqual(createGrid(['..', '..', 'o.', '..', '#.', '##']));
  });

  it('should lay no gem in a vertical level when no floor leaves room over its head', () => {
    expect(
      findGems(
        placeGems(
          createFloors([0, 3, 6, 9, 12, 15, 18]),
          'VERTICAL',
          createRandom(SEED),
        ),
      ),
    ).toEqual([]);
  });

  it('should give back an empty horizontal level when it gets one', () => {
    expect(placeGems([], 'HORIZONTAL', createRandom(SEED))).toEqual([]);
  });

  it('should give back an empty vertical level when it gets one', () => {
    expect(placeGems([], 'VERTICAL', createRandom(SEED))).toEqual([]);
  });

  it('should strew the ground the same way twice when the generator starts from the same seed', () => {
    expect(placeGems(createGround(), 'HORIZONTAL', createRandom(SEED))).toEqual(
      placeGems(createGround(), 'HORIZONTAL', createRandom(SEED)),
    );
  });

  it('should strew a vertical level the same way twice when the generator starts from the same seed', () => {
    expect(
      placeGems(createFloors(FLOOR_ROWS), 'VERTICAL', createRandom(SEED)),
    ).toEqual(
      placeGems(createFloors(FLOOR_ROWS), 'VERTICAL', createRandom(SEED)),
    );
  });

  it('should strew the ground another way when the generator starts from another seed', () => {
    expect(
      placeGems(createGround(), 'HORIZONTAL', createRandom('DAY-1')),
    ).not.toEqual(
      placeGems(createGround(), 'HORIZONTAL', createRandom('DAY-2')),
    );
  });

  it('should hand every level its gems when a day is dealt', () => {
    const bare = filter(
      flatMap(
        times(10, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
        (date) =>
          map(generate(date).levels, (level, index) => ({
            index,
            gems: size(findGems(level.tiles)),
          })),
      ),
      ({ gems }) => gems === 0,
    );

    expect(bare).toEqual([]);
  });

  it('should not change the old grid when it strews gems', () => {
    const tiles = createGround();

    placeGems(tiles, 'HORIZONTAL', createRandom(SEED));

    expect(tiles).toEqual(createGround());
  });
});
