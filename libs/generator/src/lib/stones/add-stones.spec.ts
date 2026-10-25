import { createRandom } from '@mander/engine';
import {
  isSolidTile,
  type Tile,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_STONE,
} from '@mander/model';
import {
  countBy,
  every,
  filter,
  findIndex,
  flatten,
  includes,
  keys,
  map,
  range,
  size,
  some,
  sortBy,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../consts';
import { createWorld } from '../create-world';
import { addStones } from './add-stones';

interface Cell {
  row: number;
  column: number;
}

const SEED = 'DAY-1';

const WIDTH = 24;

const DEPTHS = [DIRT_DEPTH, DEEP_DIRT_DEPTH];

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const createGround = (sky: number, depth: number): Tile[][] => [
  ...times(sky, () => times(WIDTH, (): Tile => TILE_AIR)),
  ...times(depth, () => times(WIDTH, (): Tile => TILE_DIRT)),
];

const filterCells = (tiles: Tile[][], wanted: Tile): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      map(
        filter(range(size(cells)), (column) => cells[column] === wanted),
        (column) => ({ row, column }),
      ),
    ),
  );

const countCover = (tiles: Tile[][], { row, column }: Cell): number =>
  size(
    filter(
      times(row, (above) => tiles[row - above - 1][column]),
      isSolidTile,
    ),
  );

const findSurfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (cells) => isSolidTile(cells[column]));

const findStoneRow = (tiles: Tile[][], column: number, from = 0): number =>
  findIndex(tiles, (cells) => cells[column] === TILE_STONE, from);

const computeStoneDepth = (tiles: Tile[][], column: number): number =>
  findStoneRow(tiles, column) - findSurfaceRow(tiles, column);

const countStoneCompany = (tiles: Tile[][], { row, column }: Cell): number =>
  size(
    filter(
      [
        tiles[row - 1]?.[column],
        tiles[row + 1]?.[column],
        tiles[row]?.[column - 1],
        tiles[row]?.[column + 1],
      ],
      (tile) => tile === TILE_STONE,
    ),
  );

const ROUGH_GROUND = createGrid([
  '........................',
  '.......#................',
  '......###.....##........',
  '.##..#####...####.......',
  '###################..###',
  ...times(16, () => '########################'),
]);

describe('addStones', () => {
  it('should settle the stone three or four blocks under the ground when the ground is deep enough', () => {
    const settled = addStones(createGround(4, 12), createRandom(SEED));

    expect(includes(DEPTHS, computeStoneDepth(settled, 0))).toBe(true);
    expect(
      every(
        times(size(settled) - findStoneRow(settled, 0)),
        (below) => settled[findStoneRow(settled, 0) + below][0] === TILE_STONE,
      ),
    ).toBe(true);
  });

  it('should lay the stone line level when the ground is even', () => {
    const settled = addStones(createGround(4, 12), createRandom(SEED));

    expect(
      uniq(times(WIDTH, (column) => findStoneRow(settled, column))),
    ).toEqual([findStoneRow(settled, 0)]);
  });

  it('should pick the deeper start about half the time when the generator starts from many seeds', () => {
    const picked = countBy(
      map(
        times(120, (day) =>
          addStones(createGround(3, 14), createRandom(`DAY-${day}`)),
        ),
        (settled) => computeStoneDepth(settled, 2),
      ),
    );

    expect(sortBy(keys(picked))).toEqual([
      `${DIRT_DEPTH}`,
      `${DEEP_DIRT_DEPTH}`,
    ]);
    expect(picked[DIRT_DEPTH]).toBeGreaterThan(30);
    expect(picked[DEEP_DIRT_DEPTH]).toBeGreaterThan(30);
  }, 120000);

  it('should lay the same stone twice over when the generator starts from the same seed', () => {
    expect(addStones(createGround(4, 12), createRandom(SEED))).toEqual(
      addStones(createGround(4, 12), createRandom(SEED)),
    );
  });

  it('should lay the stone another way when the generator starts from another seed', () => {
    expect(addStones(createGround(4, 12), createRandom('DAY-3'))).not.toEqual(
      addStones(createGround(4, 12), createRandom(SEED)),
    );
  });

  it('should leave the ground as dirt all the way down when it is shallower than the stone depth', () => {
    expect(
      filterCells(
        addStones(createGround(4, DIRT_DEPTH), createRandom(SEED)),
        TILE_STONE,
      ),
    ).toEqual([]);
  });

  it('should count the blocks down from the surface it finds when sky sits above it', () => {
    const settled = addStones(createGround(0, 16), createRandom(SEED));

    expect(includes(DEPTHS, findStoneRow(settled, 0))).toBe(true);
  });

  it('should start counting afresh when the ground lies under an overhang', () => {
    const settled = addStones(
      createGrid([
        '........................',
        ...times(16, () => '########################'),
        '........................',
        '........................',
        ...times(16, () => '########################'),
      ]),
      createRandom(SEED),
    );

    const roof = computeStoneDepth(settled, 0);
    const cellar = findStoneRow(settled, 0, 19) - 19;

    expect(includes(DEPTHS, roof)).toBe(true);
    expect(includes(DEPTHS, cellar)).toBe(true);
    expect(settled[19][0]).toBe(TILE_DIRT);
  });

  it('should keep three blocks of cover over the stone when it settles one', () => {
    const settled = addStones(ROUGH_GROUND, createRandom(SEED));

    const stones = filterCells(settled, TILE_STONE);

    expect(size(stones)).toBeGreaterThan(0);
    expect(
      every(stones, (cell) => countCover(settled, cell) >= DIRT_DEPTH),
    ).toBe(true);
  });

  it('should leave the tile where it lay when it is not dirt', () => {
    const tiles = createGround(4, 12);
    tiles[10][3] = TILE_BRICK;
    tiles[11][4] = TILE_SPIKE;

    const settled = addStones(tiles, createRandom(SEED));

    expect(settled[10][3]).toBe(TILE_BRICK);
    expect(settled[11][4]).toBe(TILE_SPIKE);
  });

  it('should smooth the line when the depth rule cuts it ragged', () => {
    const settled = addStones(
      createGrid([
        '........................',
        '........................',
        '.#.#.#.#.#.#.#.#.#.#.#.#',
        ...times(12, () => '########################'),
      ]),
      createRandom(SEED),
    );

    expect(
      uniq(times(WIDTH, (column) => findStoneRow(settled, column))),
    ).toEqual([findStoneRow(settled, 0)]);
  });

  it('should spare the pillar its streak when it stands on its own', () => {
    const settled = addStones(
      createGrid([
        '........................',
        ...times(6, () => '...#....................'),
        ...times(7, () => '########################'),
      ]),
      createRandom(SEED),
    );

    expect(some(times(6, (row) => settled[row + 1][3] === TILE_STONE))).toBe(
      false,
    );
    expect(size(filterCells(settled, TILE_STONE))).toBeGreaterThan(0);
  });

  it('should round the corner off when the ground falls away at the lip of a pit', () => {
    const brink = 16;

    const settled = addStones(
      createGrid([
        '................................................',
        ...times(5, () => '################................################'),
        ...times(14, () => '################################################'),
      ]),
      createRandom(SEED),
    );
    const lip = times(brink, (column) => findStoneRow(settled, column));
    const bend = findIndex(lip, (row) => row > lip[0]);

    expect(settled[5][brink - 1]).toBe(TILE_DIRT);
    expect(lip[brink - 1] - lip[0]).toBeGreaterThanOrEqual(3);
    expect(bend).toBeLessThanOrEqual(brink / 2);
    expect(every(times(brink - 1, (step) => lip[step] <= lip[step + 1]))).toBe(
      true,
    );
  });

  it('should leave no stone stranded when it settles them on rough ground', () => {
    const settled = addStones(ROUGH_GROUND, createRandom(SEED));

    expect(size(filterCells(settled, TILE_STONE))).toBeGreaterThan(0);
    expect(
      filter(
        filterCells(settled, TILE_STONE),
        (cell) => countStoneCompany(settled, cell) < 2,
      ),
    ).toEqual([]);
  });

  it('should settle stone into every level when a day is dealt', () => {
    const bare = filter(
      flatten(
        map(
          times(10, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
          (date) =>
            map(createWorld(date).levels, (level, index) => ({
              index,
              stones: size(filterCells(level.tiles, TILE_STONE)),
            })),
        ),
      ),
      ({ stones }) => stones === 0,
    );

    expect(bare).toEqual([]);
  }, 120000);

  it('should give back an empty grid when the grid is empty', () => {
    expect(addStones([], createRandom(SEED))).toEqual([]);
  });

  it('should not change the old grid when it settles stone', () => {
    const tiles = createGround(4, 12);

    addStones(tiles, createRandom(SEED));

    expect(tiles).toEqual(createGround(4, 12));
  });
});
