import {
  TILE_AIR,
  TILE_CHEST,
  TILE_DIRT,
  TILE_GEM,
  TILE_PORTAL,
  type Tile,
} from '@mander/model';
import { filter, flatten, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CHEST_HEIGHT } from '../consts';
import type { LevelType } from '../types/level-type';
import { addChest } from './add-chest';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  o: TILE_GEM,
  P: TILE_PORTAL,
  C: TILE_CHEST,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const addInRows = (rows: string[], levelType: LevelType) =>
  addChest(createGrid(rows), levelType);

const HORIZONTAL_LEVEL = ['....P.', '....P.', '######'];

const VERTICAL_LEVEL = ['.P...', '.P...', '#####', '.....', '#####'];

describe('addChest', () => {
  it('should put the chest two columns left of the portal in a horizontal level when the floor there is free', () => {
    expect(addInRows(HORIZONTAL_LEVEL, 'HORIZONTAL')).toEqual(
      createGrid(['....P.', '..C.P.', '######']),
    );
  });

  it('should take the next column to the left in a horizontal level when something is in the way of the first one', () => {
    expect(addInRows(['....P.', '..o.P.', '######'], 'HORIZONTAL')).toEqual(
      createGrid(['....P.', '.Co.P.', '######']),
    );
  });

  it('should stand the chest on the ledge of a horizontal level when the column has one', () => {
    expect(addInRows(['....P.', '..#.P.', '######'], 'HORIZONTAL')).toEqual(
      createGrid(['..C.P.', '..#.P.', '######']),
    );
  });

  it('should count from the right edge of a horizontal level when it has no portal', () => {
    expect(addInRows(['......', '######'], 'HORIZONTAL')).toEqual(
      createGrid(['...C..', '######']),
    );
  });

  it('should leave a horizontal level alone when there is no room left of the portal', () => {
    expect(addInRows(['.P....', '.P....', '######'], 'HORIZONTAL')).toEqual(
      createGrid(['.P....', '.P....', '######']),
    );
  });

  it('should put the chest on the left of the portal floor in a vertical level when there is room on it', () => {
    expect(addInRows(VERTICAL_LEVEL, 'VERTICAL')).toEqual(
      createGrid(['.P...', 'CP...', '#####', '.....', '#####']),
    );
  });

  it('should skip the floors above the portal in a vertical level when it has some', () => {
    expect(
      addInRows(['.....', '#####', '..P..', '..P..', '#####'], 'VERTICAL'),
    ).toEqual(createGrid(['.....', '#####', '..P..', 'C.P..', '#####']));
  });

  it('should pick a lower floor of a vertical level when the portal floor has no room', () => {
    expect(
      addInRows(['oPooo', 'oPooo', '#####', '.....', '#####'], 'VERTICAL'),
    ).toEqual(createGrid(['oPooo', 'oPooo', '#####', 'C....', '#####']));
  });

  it('should count from the top row of a vertical level when it has no portal', () => {
    expect(addInRows(['...', '###', '...', '###'], 'VERTICAL')).toEqual(
      createGrid(['...', '###', 'C..', '###']),
    );
  });

  it('should make the chest as tall as the chest height in a horizontal level when it places one', () => {
    expect(
      filter(
        flatten(addInRows(HORIZONTAL_LEVEL, 'HORIZONTAL')),
        (tile) => tile === TILE_CHEST,
      ),
    ).toHaveLength(CHEST_HEIGHT);
  });

  it('should make the chest as tall as the chest height in a vertical level when it places one', () => {
    expect(
      filter(
        flatten(addInRows(VERTICAL_LEVEL, 'VERTICAL')),
        (tile) => tile === TILE_CHEST,
      ),
    ).toHaveLength(CHEST_HEIGHT);
  });

  it('should leave a vertical level alone when there is nowhere to stand', () => {
    expect(addInRows(['...', '...', '...'], 'VERTICAL')).toEqual(
      createGrid(['...', '...', '...']),
    );
  });

  it('should give back an empty horizontal level when it gets one', () => {
    expect(addChest([], 'HORIZONTAL')).toEqual([]);
  });

  it('should give back an empty vertical level when it gets one', () => {
    expect(addChest([], 'VERTICAL')).toEqual([]);
  });

  it('should not change the old grid when it places the chest', () => {
    const tiles = createGrid(HORIZONTAL_LEVEL);

    addChest(tiles, 'HORIZONTAL');

    expect(tiles).toEqual(createGrid(HORIZONTAL_LEVEL));
  });
});
