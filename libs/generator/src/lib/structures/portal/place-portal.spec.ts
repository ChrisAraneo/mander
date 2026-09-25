import {
  PORTAL_HEIGHT,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_PORTAL,
  type Tile,
} from '@mander/model';
import { filter, flatten, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { placePortal } from './place-portal';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  P: TILE_PORTAL,
};

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const OPEN_LEVEL = ['....', '....', '####'];

describe('placePortal', () => {
  it('should put the portal in the second column from the right when the whole floor is free', () => {
    expect(placePortal(grid(OPEN_LEVEL))).toEqual(
      grid(['..P.', '..P.', '####']),
    );
  });

  it('should take the next column to the left when something is in the way of the best one', () => {
    expect(placePortal(grid(['....', '..o.', '####']))).toEqual(
      grid(['.P..', '.Po.', '####']),
    );
  });

  it('should take the next column to the left when the best one has no room above its floor', () => {
    expect(placePortal(grid(['....', '..#.', '####']))).toEqual(
      grid(['.P..', '.P#.', '####']),
    );
  });

  it('should use the last column when the three before it are blocked', () => {
    expect(placePortal(grid(['....', 'ooo.', '####']))).toEqual(
      grid(['...P', 'oooP', '####']),
    );
  });

  it('should stand the portal on the ledge when the column has one', () => {
    expect(placePortal(grid(['.....', '.....', '...#.', '#####']))).toEqual(
      grid(['...P.', '...P.', '...#.', '#####']),
    );
  });

  it('should look past the last four columns when none of them has room', () => {
    expect(placePortal(grid(['........', '........', '##......']))).toEqual(
      grid(['.P......', '.P......', '##......']),
    );
  });

  it('should make the portal as tall as the portal height when it places one', () => {
    expect(
      filter(
        flatten(placePortal(grid(OPEN_LEVEL))),
        (tile) => tile === TILE_PORTAL,
      ),
    ).toHaveLength(PORTAL_HEIGHT);
  });

  it('should leave the grid alone when no column has room', () => {
    expect(placePortal(grid(['...', '...', '...']))).toEqual(
      grid(['...', '...', '...']),
    );
  });

  it('should give back an empty grid when it gets one', () => {
    expect(placePortal([])).toEqual([]);
  });

  it('should not change the old grid when it places the portal', () => {
    const tiles = grid(OPEN_LEVEL);

    placePortal(tiles);

    expect(tiles).toEqual(grid(OPEN_LEVEL));
  });
});
