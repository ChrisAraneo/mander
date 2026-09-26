import { TILE_AIR, TILE_DIRT, TILE_GEM, type Tile } from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { findLowestFilledRow } from './find-lowest-filled-row';

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) =>
    map([...row], (cell) =>
      // '#' is ground, 'o' is a gem: not solid, but not empty either
      cell === '#' ? TILE_DIRT : cell === 'o' ? TILE_GEM : TILE_AIR,
    ),
  );

const lowest = (rows: string[]): number => {
  const tiles = grid(rows);

  return findLowestFilledRow({ tiles, front: tiles }).lowest;
};

describe('findLowestFilledRow', () => {
  it('should give the bottom row when the floor is filled', () => {
    expect(lowest(['....', '####'])).toBe(1);
  });

  it('should give the last row with a block when there is air under it', () => {
    expect(lowest(['#...', '..#.', '....'])).toBe(1);
  });

  it('should count a row as filled when it only has a gem in it', () => {
    expect(lowest(['#...', '.o..', '....'])).toBe(1);
  });

  it('should give -1 when the grid is all air', () => {
    expect(lowest(['....', '....'])).toBe(-1);
  });

  it('should give -1 when the grid is empty', () => {
    expect(lowest([])).toBe(-1);
  });

  it('should look at the front layer when it is not the grid being padded', () => {
    expect(
      findLowestFilledRow({
        tiles: grid(['####', '....', '....']),
        front: grid(['....', '....', '####']),
      }).lowest,
    ).toBe(2);
  });

  it('should keep the grid and the front layer the same when it looks for the row', () => {
    const tiles = grid(['....', '####']);
    const front = grid(['####', '....']);
    const found = findLowestFilledRow({ tiles, front });

    expect(found.tiles).toBe(tiles);
    expect(found.front).toBe(front);
  });
});
