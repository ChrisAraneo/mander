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

import type { LevelType } from '../get-level-type';
import { placePortal } from './place-portal';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  P: TILE_PORTAL,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const placeInRows = (rows: string[], levelType: LevelType) =>
  placePortal(createGrid(rows), levelType);

const HORIZONTAL_LEVEL = ['....', '....', '####'];

const VERTICAL_LEVEL = ['.....', '.....', '#####'];

describe('placePortal', () => {
  it('should put the portal in the second column from the right of a horizontal level when the whole floor is free', () => {
    expect(placeInRows(HORIZONTAL_LEVEL, 'HORIZONTAL')).toEqual(
      createGrid(['..P.', '..P.', '####']),
    );
  });

  it('should take the next column to the left in a horizontal level when something is in the way of the best one', () => {
    expect(placeInRows(['....', '..o.', '####'], 'HORIZONTAL')).toEqual(
      createGrid(['.P..', '.Po.', '####']),
    );
  });

  it('should take the next column to the left in a horizontal level when the best one has no room above its floor', () => {
    expect(placeInRows(['....', '..#.', '####'], 'HORIZONTAL')).toEqual(
      createGrid(['.P..', '.P#.', '####']),
    );
  });

  it('should use the last column of a horizontal level when the three before it are blocked', () => {
    expect(placeInRows(['....', 'ooo.', '####'], 'HORIZONTAL')).toEqual(
      createGrid(['...P', 'oooP', '####']),
    );
  });

  it('should stand the portal on the ledge of a horizontal level when the column has one', () => {
    expect(
      placeInRows(['.....', '.....', '...#.', '#####'], 'HORIZONTAL'),
    ).toEqual(createGrid(['...P.', '...P.', '...#.', '#####']));
  });

  it('should look past the last four columns of a horizontal level when none of them has room', () => {
    expect(
      placeInRows(['........', '........', '##......'], 'HORIZONTAL'),
    ).toEqual(createGrid(['.P......', '.P......', '##......']));
  });

  it('should put the portal in the middle column of a vertical level when the whole floor is free', () => {
    expect(placeInRows(VERTICAL_LEVEL, 'VERTICAL')).toEqual(
      createGrid(['..P..', '..P..', '#####']),
    );
  });

  it('should stand the portal on the highest floor of a vertical level when it has more than one', () => {
    expect(
      placeInRows(
        ['.....', '.....', '#####', '.....', '.....', '#####'],
        'VERTICAL',
      ),
    ).toEqual(
      createGrid(['..P..', '..P..', '#####', '.....', '.....', '#####']),
    );
  });

  it('should take the column nearest the middle of a vertical level when something is in the way of the middle one', () => {
    expect(placeInRows(['.....', '..o..', '#####'], 'VERTICAL')).toEqual(
      createGrid(['.P...', '.Po..', '#####']),
    );
  });

  it('should pick a lower floor of a vertical level when the highest one has no room for the portal', () => {
    expect(
      placeInRows(['...', '###', '...', '...', '###'], 'VERTICAL'),
    ).toEqual(createGrid(['...', '###', '.P.', '.P.', '###']));
  });

  it('should make the portal as tall as the portal height in a horizontal level when it places one', () => {
    expect(
      filter(
        flatten(placeInRows(HORIZONTAL_LEVEL, 'HORIZONTAL')),
        (tile) => tile === TILE_PORTAL,
      ),
    ).toHaveLength(PORTAL_HEIGHT);
  });

  it('should make the portal as tall as the portal height in a vertical level when it places one', () => {
    expect(
      filter(
        flatten(placeInRows(VERTICAL_LEVEL, 'VERTICAL')),
        (tile) => tile === TILE_PORTAL,
      ),
    ).toHaveLength(PORTAL_HEIGHT);
  });

  it('should leave a horizontal level alone when no column has room', () => {
    expect(placeInRows(['...', '...', '...'], 'HORIZONTAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should leave a vertical level alone when there is nowhere to stand', () => {
    expect(placeInRows(['...', '...', '...'], 'VERTICAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should give back an empty horizontal level when it gets one', () => {
    expect(placePortal([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give back an empty vertical level when it gets one', () => {
    expect(placePortal([], 'VERTICAL')).toEqual([]);
  });

  it('should not change the old grid when it places the portal', () => {
    const tiles = createGrid(HORIZONTAL_LEVEL);

    placePortal(tiles, 'HORIZONTAL');

    expect(tiles).toEqual(createGrid(HORIZONTAL_LEVEL));
  });
});
