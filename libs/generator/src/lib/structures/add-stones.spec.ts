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
  join,
  keys,
  map,
  size,
  some,
  times,
  uniq,
} from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { generate } from '../generate';
import { addStones } from './add-stones';

const DIRT_DEPTH = 3;

const DEEP_DIRT_DEPTH = 4;

const WIDTH = 24;

const DEPTHS = [DIRT_DEPTH, DEEP_DIRT_DEPTH];

interface Cell {
  row: number;
  column: number;
}

const ground = (sky: number, depth: number, width = WIDTH): Tile[][] => [
  ...times(sky, () => times(width, (): Tile => TILE_AIR)),
  ...times(depth, () => times(width, (): Tile => TILE_DIRT)),
];

const carve = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map(row.split(''), (cell): Tile => (cell === '.' ? TILE_AIR : TILE_DIRT)),
  );

const cellsOf = (tiles: Tile[][], wanted: Tile): Cell[] =>
  flatten(
    map(tiles, (cells, row) =>
      filter(
        map(cells, (tile, column) => ({ tile, row, column })),
        ({ tile }) => tile === wanted,
      ),
    ),
  );

const coverOver = (tiles: Tile[][], { row, column }: Cell): number =>
  size(
    filter(
      times(row, (above) => tiles[row - above - 1][column]),
      isSolidTile,
    ),
  );

const surfaceRow = (tiles: Tile[][], column: number): number =>
  findIndex(tiles, (cells) => isSolidTile(cells[column]));

const stoneRow = (tiles: Tile[][], column: number, from = 0): number =>
  findIndex(tiles, (cells) => cells[column] === TILE_STONE, from);

const stoneDepth = (tiles: Tile[][], column: number): number =>
  stoneRow(tiles, column) - surfaceRow(tiles, column);

const company = (tiles: Tile[][], { row, column }: Cell): number =>
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

const ROUGH_GROUND = carve([
  '........................',
  '.......D................',
  '......DDD.....DD........',
  '.DD..DDDDD...DDDD.......',
  'DDDDDDDDDDDDDDDDDDD..DDD',
  ...times(16, () => 'DDDDDDDDDDDDDDDDDDDDDDDD'),
]);

const fingerprint = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );

describe('addStones', () => {
  it('settles stone three or four blocks under the ground', () => {
    const settled = addStones(ground(4, 12));

    expect(includes(DEPTHS, stoneDepth(settled, 0))).toBe(true);
    expect(
      every(
        times(size(settled) - stoneRow(settled, 0)),
        (below) => settled[stoneRow(settled, 0) + below][0] === TILE_STONE,
      ),
    ).toBe(true);
  });

  it('lays the stone line level across even ground', () => {
    const settled = addStones(ground(4, 12));

    expect(uniq(times(WIDTH, (column) => stoneRow(settled, column)))).toEqual([
      stoneRow(settled, 0),
    ]);
  });

  it('deals the deeper start about half the time', () => {
    const dealt = countBy(
      map(
        times(120, (index) => addStones(ground(3, 14, WIDTH + index))),
        (settled) => stoneDepth(settled, 2),
      ),
    );

    expect(keys(dealt).sort()).toEqual([`${DIRT_DEPTH}`, `${DEEP_DIRT_DEPTH}`]);
    expect(dealt[DIRT_DEPTH]).toBeGreaterThan(30);
    expect(dealt[DEEP_DIRT_DEPTH]).toBeGreaterThan(30);
  });

  it('deals the same ground the same stone twice over', () => {
    const tiles = ground(4, 12);

    expect(fingerprint(addStones(tiles))).toBe(fingerprint(addStones(tiles)));
  });

  it('leaves shallower ground as dirt all the way down', () => {
    expect(cellsOf(addStones(ground(4, DIRT_DEPTH)), TILE_STONE)).toEqual([]);
  });

  it('counts the blocks down from the surface it finds, not the sky', () => {
    const settled = addStones(ground(0, 16));

    expect(includes(DEPTHS, stoneRow(settled, 0))).toBe(true);
  });

  it('starts counting afresh under an overhang', () => {
    const settled = addStones(
      carve([
        '........................',
        ...times(16, () => 'DDDDDDDDDDDDDDDDDDDDDDDD'),
        '........................',
        '........................',
        ...times(16, () => 'DDDDDDDDDDDDDDDDDDDDDDDD'),
      ]),
    );
    const roof = stoneDepth(settled, 0);
    const cellar = stoneRow(settled, 0, 19) - 19;

    expect(includes(DEPTHS, roof)).toBe(true);
    expect(includes(DEPTHS, cellar)).toBe(true);
    expect(settled[19][0]).toBe(TILE_DIRT);
  });

  it('keeps three blocks of cover over every stone it settles', () => {
    const settled = addStones(ROUGH_GROUND);
    const stones = cellsOf(settled, TILE_STONE);

    expect(size(stones)).toBeGreaterThan(0);
    expect(
      every(stones, (cell) => coverOver(settled, cell) >= DIRT_DEPTH),
    ).toBe(true);
  });

  it('leaves everything that is not dirt where it lay', () => {
    const tiles = ground(4, 12);
    tiles[10][3] = TILE_BRICK;
    tiles[11][4] = TILE_SPIKE;

    const settled = addStones(tiles);

    expect(settled[10][3]).toBe(TILE_BRICK);
    expect(settled[11][4]).toBe(TILE_SPIKE);
  });

  it('smooths the ragged line the depth rule cuts', () => {
    const settled = addStones(
      carve([
        '........................',
        '........................',
        '.D.D.D.D.D.D.D.D.D.D.D.D',
        ...times(12, () => 'DDDDDDDDDDDDDDDDDDDDDDDD'),
      ]),
    );

    expect(uniq(times(WIDTH, (column) => stoneRow(settled, column)))).toEqual([
      stoneRow(settled, 0),
    ]);
  });

  it('spares a lone pillar its streak', () => {
    const settled = addStones(
      carve([
        '........................',
        ...times(6, () => '...D....................'),
        ...times(7, () => 'DDDDDDDDDDDDDDDDDDDDDDDD'),
      ]),
    );

    expect(some(times(6, (row) => settled[row + 1][3] === TILE_STONE))).toBe(
      false,
    );
    expect(size(cellsOf(settled, TILE_STONE))).toBeGreaterThan(0);
  });

  it('rounds the corner off the lip of a pit', () => {
    const brink = 16;
    const settled = addStones(
      carve([
        '................................................',
        ...times(5, () => 'DDDDDDDDDDDDDDDD................DDDDDDDDDDDDDDDD'),
        ...times(14, () => 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'),
      ]),
    );
    const lip = times(brink, (column) => stoneRow(settled, column));
    const bend = findIndex(lip, (row) => row > lip[0]);

    expect(settled[5][brink - 1]).toBe(TILE_DIRT);
    expect(lip[brink - 1] - lip[0]).toBeGreaterThanOrEqual(3);
    expect(bend).toBeLessThanOrEqual(brink / 2);
    expect(every(times(brink - 1, (step) => lip[step] <= lip[step + 1]))).toBe(
      true,
    );
  });

  it('leaves no stone stranded on its own', () => {
    const settled = addStones(ROUGH_GROUND);

    expect(size(cellsOf(settled, TILE_STONE))).toBeGreaterThan(0);
    expect(
      filter(
        cellsOf(settled, TILE_STONE),
        (cell) => company(settled, cell) < 2,
      ),
    ).toEqual([]);
  });

  it('leaves the ground it was given untouched', () => {
    const tiles = ground(4, 12);
    const before = fingerprint(tiles);

    addStones(tiles);

    expect(fingerprint(tiles)).toBe(before);
  });

  it('settles stone into every level of a dealt day', () => {
    const bare = filter(
      flatten(
        map(
          times(10, (day) => new Date(Date.UTC(2026, 7, 1 + day))),
          (date) =>
            map(generate(date).levels, (level, index) => ({
              index,
              stones: size(cellsOf(level.tiles, TILE_STONE)),
            })),
        ),
      ),
      ({ stones }) => stones === 0,
    );

    expect(bare).toEqual([]);
  });
});
