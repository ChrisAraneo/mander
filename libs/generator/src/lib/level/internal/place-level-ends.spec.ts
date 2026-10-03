import {
  TILE_AIR,
  TILE_DIRT,
  TILE_PORTAL,
  TILE_SPAWN,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { createRandom } from '@mander/utils';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { LevelType } from '../../types/level-type';
import { placeLevelEnds } from './place-level-ends';

const RANDOM = createRandom('SEED');

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  P: TILE_PORTAL,
  '@': TILE_SPAWN,
};

const createGrid = (rows: string[]): Tile[][] =>
  map(rows, (row) => map([...row], (cell) => TILES[cell] ?? TILE_AIR));

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const placeIn = (rows: string[], levelType: LevelType) =>
  placeLevelEnds({
    levelNumber: 1,
    levelType,
    structures: STRUCTURES,
    random: RANDOM,
    tiles: createGrid(rows),
    backTiles: BACK_LEVEL,
  });

describe('placeLevelEnds', () => {
  it('should put the player near the left and the portal near the right in a horizontal level when the floor is free', () => {
    expect(placeIn(['....', '....', '####'], 'HORIZONTAL').tiles).toEqual(
      createGrid(['.@P.', '.@P.', '####']),
    );
  });

  it('should put the player on the lowest floor and the portal on the highest in a vertical level when it has two floors', () => {
    expect(
      placeIn(
        ['...', '...', '...', '###', '...', '...', '...', '###'],
        'VERTICAL',
      ).tiles,
    ).toEqual(
      createGrid(['...', '.P.', '.P.', '###', '...', '.@.', '.@.', '###']),
    );
  });

  it('should give back an empty grid in a horizontal level when the grid is empty', () => {
    expect(placeIn([], 'HORIZONTAL').tiles).toEqual([]);
  });

  it('should give back an empty grid in a vertical level when the grid is empty', () => {
    expect(placeIn([], 'VERTICAL').tiles).toEqual([]);
  });

  it('should pass the generator on when it places the ends', () => {
    expect(placeIn([], 'HORIZONTAL').random).toBe(RANDOM);
  });

  it('should pass the level number on when it places the ends', () => {
    expect(placeIn([], 'HORIZONTAL').levelNumber).toBe(1);
  });

  it('should pass the level type on when it places the ends', () => {
    expect(placeIn([], 'VERTICAL').levelType).toBe('VERTICAL');
  });

  it('should pass the structures on when it places the ends', () => {
    expect(placeIn([], 'HORIZONTAL').structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it places the ends', () => {
    expect(placeIn([], 'HORIZONTAL').backTiles).toBe(BACK_LEVEL);
  });
});
