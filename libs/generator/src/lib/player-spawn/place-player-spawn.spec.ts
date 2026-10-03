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

import type { LevelType } from '../types/level-type';
import { placePlayerSpawn } from './place-player-spawn';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  '@': TILE_SPAWN,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const placeSpawn = (rows: string[], levelType: LevelType) =>
  placePlayerSpawn(createGrid(rows), levelType);

const HORIZONTAL_LEVEL = ['....', '....', '####'];

const VERTICAL_LEVEL = ['.....', '.....', '.....', '.....', '#####'];

describe('placePlayerSpawn', () => {
  it('should put the player in the second column of a horizontal level when the whole floor is free', () => {
    expect(placeSpawn(HORIZONTAL_LEVEL, 'HORIZONTAL')).toEqual(
      createGrid(['.@..', '.@..', '####']),
    );
  });

  it('should take the next column of a horizontal level when something is in the way of the best one', () => {
    expect(placeSpawn(['....', '.o..', '####'], 'HORIZONTAL')).toEqual(
      createGrid(['..@.', '.o@.', '####']),
    );
  });

  it('should take the next column of a horizontal level when the best one has no room above its floor', () => {
    expect(placeSpawn(['....', '.#..', '####'], 'HORIZONTAL')).toEqual(
      createGrid(['..@.', '.#@.', '####']),
    );
  });

  it('should stand the player on the ledge of a horizontal level when the column has one', () => {
    expect(
      placeSpawn(['.....', '.....', '.#...', '#####'], 'HORIZONTAL'),
    ).toEqual(createGrid(['.@...', '.@...', '.#...', '#####']));
  });

  it('should look past the first six columns of a horizontal level when none of them has room', () => {
    expect(
      placeSpawn(['........', '........', '......##'], 'HORIZONTAL'),
    ).toEqual(createGrid(['......@.', '......@.', '......##']));
  });

  it('should put the player in the middle column of a vertical level when the whole floor is free', () => {
    expect(placeSpawn(VERTICAL_LEVEL, 'VERTICAL')).toEqual(
      createGrid(['.....', '.....', '..@..', '..@..', '#####']),
    );
  });

  it('should stand the player on the lowest floor of a vertical level when it has more than one', () => {
    expect(
      placeSpawn(
        [
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
        ],
        'VERTICAL',
      ),
    ).toEqual(
      createGrid([
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

  it('should take the column nearest the middle of a vertical level when something is in the way of the middle one', () => {
    expect(
      placeSpawn(['.....', '.....', '.....', '..o..', '#####'], 'VERTICAL'),
    ).toEqual(createGrid(['.....', '.....', '.@...', '.@o..', '#####']));
  });

  it('should pick a higher floor of a vertical level when the lower one has no room for the player to stand up', () => {
    expect(
      placeSpawn(
        ['...', '...', '...', '...', '###', '...', '...', '###'],
        'VERTICAL',
      ),
    ).toEqual(
      createGrid(['...', '...', '.@.', '.@.', '###', '...', '...', '###']),
    );
  });

  it('should settle for a low candidate in a vertical level when no floor has room for the player to stand up', () => {
    expect(placeSpawn(['.....', '.....', '#####'], 'VERTICAL')).toEqual(
      createGrid(['..@..', '..@..', '#####']),
    );
  });

  it('should make the player as tall as the spawn height in a horizontal level when it places one', () => {
    expect(
      filter(
        flatten(placeSpawn(HORIZONTAL_LEVEL, 'HORIZONTAL')),
        (tile) => tile === TILE_SPAWN,
      ),
    ).toHaveLength(SPAWN_HEIGHT);
  });

  it('should make the player as tall as the spawn height in a vertical level when it places one', () => {
    expect(
      filter(
        flatten(placeSpawn(VERTICAL_LEVEL, 'VERTICAL')),
        (tile) => tile === TILE_SPAWN,
      ),
    ).toHaveLength(SPAWN_HEIGHT);
  });

  it('should leave a horizontal level alone when no column has room', () => {
    expect(placeSpawn(['...', '...', '...'], 'HORIZONTAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should leave a vertical level alone when there is nowhere to stand', () => {
    expect(placeSpawn(['...', '...', '...'], 'VERTICAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should give back an empty horizontal level when it gets one', () => {
    expect(placePlayerSpawn([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give back an empty vertical level when it gets one', () => {
    expect(placePlayerSpawn([], 'VERTICAL')).toEqual([]);
  });

  it('should not change the old grid when it places the player', () => {
    const tiles = createGrid(HORIZONTAL_LEVEL);

    placePlayerSpawn(tiles, 'HORIZONTAL');

    expect(tiles).toEqual(createGrid(HORIZONTAL_LEVEL));
  });
});
