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

import { DEEP_DIRT_DEPTH, DIRT_DEPTH } from '../../consts';
import { generate } from '../../generate';
import { placeStones } from './place-stones';

interface Cell {
  row: number;
  column: number;
}

const WIDTH = 24;

const DEPTHS = [DIRT_DEPTH, DEEP_DIRT_DEPTH];

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const createGround = (sky: number, depth: number, width = WIDTH): Tile[][] => [
  ...times(sky, () => times(width, (): Tile => TILE_AIR)),
  ...times(depth, () => times(width, (): Tile => TILE_DIRT)),
];

const findCells = (tiles: Tile[][], wanted: Tile): Cell[] =>
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

const measureStoneDepth = (tiles: Tile[][], column: number): number =>
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

describe('placeStones', () => {
  it('should settle the stone three or four blocks under the ground when the ground is deep enough', () => {
    const settled = placeStones(createGround(4, 12));

    expect(includes(DEPTHS, measureStoneDepth(settled, 0))).toBe(true);
    expect(
      every(
        times(size(settled) - findStoneRow(settled, 0)),
        (below) => settled[findStoneRow(settled, 0) + below][0] === TILE_STONE,
      ),
    ).toBe(true);
  });

  it('should lay the stone line level when the ground is even', () => {
    const settled = placeStones(createGround(4, 12));

    expect(
      uniq(times(WIDTH, (column) => findStoneRow(settled, column))),
    ).toEqual([findStoneRow(settled, 0)]);
  });

  it('should deal the deeper start about half the time when it settles many grounds', () => {
    const dealt = countBy(
      map(
        times(120, (index) => placeStones(createGround(3, 14, WIDTH + index))),
        (settled) => measureStoneDepth(settled, 2),
      ),
    );

    expect(sortBy(keys(dealt))).toEqual([
      `${DIRT_DEPTH}`,
      `${DEEP_DIRT_DEPTH}`,
    ]);
    expect(dealt[DIRT_DEPTH]).toBeGreaterThan(30);
    expect(dealt[DEEP_DIRT_DEPTH]).toBeGreaterThan(30);
  });

  it('should deal the same stone twice over when it is given the same ground', () => {
    expect(placeStones(createGround(4, 12))).toEqual(
      placeStones(createGround(4, 12)),
    );
  });

  it('should leave the ground as dirt all the way down when it is shallower than the stone depth', () => {
    expect(
      findCells(placeStones(createGround(4, DIRT_DEPTH)), TILE_STONE),
    ).toEqual([]);
  });

  it('should count the blocks down from the surface it finds when sky sits above it', () => {
    const settled = placeStones(createGround(0, 16));

    expect(includes(DEPTHS, findStoneRow(settled, 0))).toBe(true);
  });

  it('should start counting afresh when the ground lies under an overhang', () => {
    const settled = placeStones(
      createGrid([
        '........................',
        ...times(16, () => '########################'),
        '........................',
        '........................',
        ...times(16, () => '########################'),
      ]),
    );

    const roof = measureStoneDepth(settled, 0);
    const cellar = findStoneRow(settled, 0, 19) - 19;

    expect(includes(DEPTHS, roof)).toBe(true);
    expect(includes(DEPTHS, cellar)).toBe(true);
    expect(settled[19][0]).toBe(TILE_DIRT);
  });

  it('should keep three blocks of cover over the stone when it settles one', () => {
    const settled = placeStones(ROUGH_GROUND);

    const stones = findCells(settled, TILE_STONE);

    expect(size(stones)).toBeGreaterThan(0);
    expect(
      every(stones, (cell) => countCover(settled, cell) >= DIRT_DEPTH),
    ).toBe(true);
  });

  it('should leave the tile where it lay when it is not dirt', () => {
    const tiles = createGround(4, 12);
    tiles[10][3] = TILE_BRICK;
    tiles[11][4] = TILE_SPIKE;

    const settled = placeStones(tiles);

    expect(settled[10][3]).toBe(TILE_BRICK);
    expect(settled[11][4]).toBe(TILE_SPIKE);
  });

  it('should smooth the line when the depth rule cuts it ragged', () => {
    const settled = placeStones(
      createGrid([
        '........................',
        '........................',
        '.#.#.#.#.#.#.#.#.#.#.#.#',
        ...times(12, () => '########################'),
      ]),
    );

    expect(
      uniq(times(WIDTH, (column) => findStoneRow(settled, column))),
    ).toEqual([findStoneRow(settled, 0)]);
  });

  it('should spare the pillar its streak when it stands on its own', () => {
    const settled = placeStones(
      createGrid([
        '........................',
        ...times(6, () => '...#....................'),
        ...times(7, () => '########################'),
      ]),
    );

    expect(some(times(6, (row) => settled[row + 1][3] === TILE_STONE))).toBe(
      false,
    );
    expect(size(findCells(settled, TILE_STONE))).toBeGreaterThan(0);
  });

  it('should round the corner off when the ground falls away at the lip of a pit', () => {
    const brink = 16;

    const settled = placeStones(
      createGrid([
        '................................................',
        ...times(5, () => '################................################'),
        ...times(14, () => '################################################'),
      ]),
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
    const settled = placeStones(ROUGH_GROUND);

    expect(size(findCells(settled, TILE_STONE))).toBeGreaterThan(0);
    expect(
      filter(
        findCells(settled, TILE_STONE),
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
            map(generate(date).levels, (level, index) => ({
              index,
              stones: size(findCells(level.tiles, TILE_STONE)),
            })),
        ),
      ),
      ({ stones }) => stones === 0,
    );

    expect(bare).toEqual([]);
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(placeStones([])).toEqual([]);
  });

  it('should not change the old grid when it settles stone', () => {
    const tiles = createGround(4, 12);

    placeStones(tiles);

    expect(tiles).toEqual(createGround(4, 12));
  });
});
