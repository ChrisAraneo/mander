import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findLowestFilledRow } from './find-lowest-filled-row';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const findLowest = (rows: string[]): number =>
  findLowestFilledRow({ tiles: createGrid(rows), front: createGrid(rows) })
    .lowest;

describe('findLowestFilledRow', () => {
  it('should give the bottom row when the floor is filled', () => {
    expect(findLowest(['....', '####'])).toBe(1);
  });

  it('should give the last row with a block when there is air under it', () => {
    expect(findLowest(['#...', '..#.', '....'])).toBe(1);
  });

  it('should count a row as filled when it only has a gem in it', () => {
    expect(findLowest(['#...', '.o..', '....'])).toBe(1);
  });

  it('should give -1 when the grid is all air', () => {
    expect(findLowest(['....', '....'])).toBe(-1);
  });

  it('should give -1 when the grid is empty', () => {
    expect(findLowest([])).toBe(-1);
  });

  it('should look at the front layer when it is not the grid being padded', () => {
    expect(
      findLowestFilledRow({
        tiles: createGrid(['####', '....', '....']),
        front: createGrid(['....', '....', '####']),
      }).lowest,
    ).toBe(2);
  });

  it('should keep the grid the same when it looks for the row', () => {
    const tiles = createGrid(['....', '####']);

    expect(findLowestFilledRow({ tiles, front: tiles }).tiles).toBe(tiles);
  });

  it('should pass the front layer on when it looks for the row', () => {
    const front = createGrid(['####', '....']);

    expect(
      findLowestFilledRow({ tiles: createGrid(['....', '####']), front }).front,
    ).toBe(front);
  });
});
