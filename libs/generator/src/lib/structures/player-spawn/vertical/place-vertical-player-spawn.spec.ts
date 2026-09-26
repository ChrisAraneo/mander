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

import { placeVerticalPlayerSpawn } from './place-vertical-player-spawn';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  '@': TILE_SPAWN,
};

const grid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const OPEN_LEVEL = ['.....', '.....', '.....', '.....', '#####'];

describe('placeVerticalPlayerSpawn', () => {
  it('should put the player in the middle column when the whole floor is free', () => {
    expect(placeVerticalPlayerSpawn(grid(OPEN_LEVEL))).toEqual(
      grid(['.....', '.....', '..@..', '..@..', '#####']),
    );
  });

  it('should stand the player on the lowest floor when the level has more than one', () => {
    expect(
      placeVerticalPlayerSpawn(
        grid([
          '.....',
          '.....',
          '.....',
          '.....',
          '#####',
          '.....',
          '.....',
          '.....',
          '.....',
          '#####',
        ]),
      ),
    ).toEqual(
      grid([
        '.....',
        '.....',
        '.....',
        '.....',
        '#####',
        '.....',
        '.....',
        '..@..',
        '..@..',
        '#####',
      ]),
    );
  });

  it('should take the column nearest the middle when something is in the way of the middle one', () => {
    expect(
      placeVerticalPlayerSpawn(
        grid(['.....', '.....', '.....', '..o..', '#####']),
      ),
    ).toEqual(grid(['.....', '.....', '.@...', '.@o..', '#####']));
  });

  it('should pick a higher floor when the lower one has no room for the player to stand up', () => {
    expect(
      placeVerticalPlayerSpawn(
        grid(['...', '...', '...', '...', '###', '...', '...', '###']),
      ),
    ).toEqual(grid(['...', '...', '.@.', '.@.', '###', '...', '...', '###']));
  });

  it('should settle for a low candidate when no floor has room for the player to stand up', () => {
    expect(placeVerticalPlayerSpawn(grid(['.....', '.....', '#####']))).toEqual(
      grid(['..@..', '..@..', '#####']),
    );
  });

  it('should make the player as tall as the spawn height when it places one', () => {
    expect(
      filter(
        flatten(placeVerticalPlayerSpawn(grid(OPEN_LEVEL))),
        (tile) => tile === TILE_SPAWN,
      ),
    ).toHaveLength(SPAWN_HEIGHT);
  });

  it('should leave the grid alone when there is nowhere to stand', () => {
    expect(placeVerticalPlayerSpawn(grid(['...', '...', '...']))).toEqual(
      grid(['...', '...', '...']),
    );
  });

  it('should give back an empty grid when it gets one', () => {
    expect(placeVerticalPlayerSpawn([])).toEqual([]);
  });

  it('should not change the old grid when it places the player', () => {
    const tiles = grid(OPEN_LEVEL);

    placeVerticalPlayerSpawn(tiles);

    expect(tiles).toEqual(grid(OPEN_LEVEL));
  });
});
