import {
  SPAWN_HEIGHT,
  TILE_AIR,
  TILE_DIRT,
  TILE_GEM,
  TILE_SPAWN,
  type Tile,
} from '@mander/model';
import { filter, flatten, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { placePlayerSpawn } from './place-player-spawn';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  '@': TILE_SPAWN,
};

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const OPEN_LEVEL = ['....', '....', '####'];

describe('placePlayerSpawn', () => {
  it('should put the player in the second column when the whole floor is free', () => {
    expect(placePlayerSpawn(grid(OPEN_LEVEL))).toEqual(
      grid(['.@..', '.@..', '####']),
    );
  });

  it('should take the next column when something is in the way of the best one', () => {
    expect(placePlayerSpawn(grid(['....', '.o..', '####']))).toEqual(
      grid(['..@.', '.o@.', '####']),
    );
  });

  it('should take the next column when the best one has no room above its floor', () => {
    expect(placePlayerSpawn(grid(['....', '.#..', '####']))).toEqual(
      grid(['..@.', '.#@.', '####']),
    );
  });

  it('should stand the player on the ledge when the column has one', () => {
    expect(
      placePlayerSpawn(grid(['.....', '.....', '.#...', '#####'])),
    ).toEqual(grid(['.@...', '.@...', '.#...', '#####']));
  });

  it('should look past the first six columns when none of them has room', () => {
    expect(
      placePlayerSpawn(grid(['........', '........', '......##'])),
    ).toEqual(grid(['......@.', '......@.', '......##']));
  });

  it('should make the player as tall as the spawn height when it places one', () => {
    expect(
      filter(
        flatten(placePlayerSpawn(grid(OPEN_LEVEL))),
        (tile) => tile === TILE_SPAWN,
      ),
    ).toHaveLength(SPAWN_HEIGHT);
  });

  it('should leave the grid alone when no column has room', () => {
    expect(placePlayerSpawn(grid(['...', '...', '...']))).toEqual(
      grid(['...', '...', '...']),
    );
  });

  it('should give back an empty grid when it gets one', () => {
    expect(placePlayerSpawn([])).toEqual([]);
  });

  it('should not change the old grid when it places the player', () => {
    const tiles = grid(OPEN_LEVEL);

    placePlayerSpawn(tiles);

    expect(tiles).toEqual(grid(OPEN_LEVEL));
  });
});
