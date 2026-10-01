import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { filter, flatten, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { clearLevelTraps } from './clear-level-traps';

const TRAPS = 20;

const FIRST_UNTOUCHED_LEVEL = 5;

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const createLevel = (ground: Tile = TILE_DIRT): Tile[][] => [
  times(TRAPS, (): Tile => TILE_SPIKE),
  times(TRAPS, (): Tile => TILE_BEARTRAP),
  times(TRAPS, (): Tile => ground),
];

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

const clearOn = (levelNumber: number, tiles: Tile[][] = createLevel()) =>
  clearLevelTraps({
    seed: 'SEED',
    levelNumber,
    levelType: 'HORIZONTAL',
    structures: STRUCTURES,
    tiles,
    backTiles: BACK_LEVEL,
  });

describe('clearLevelTraps', () => {
  it('should pull every spike and half the beartraps when the level is the first', () => {
    const { tiles } = clearOn(1);

    expect(countTiles(tiles, TILE_SPIKE)).toBe(0);
    expect(countTiles(tiles, TILE_BEARTRAP)).toBe(TRAPS / 2);
  });

  it('should leave every trap set when the level is the fifth or later', () => {
    expect(clearOn(FIRST_UNTOUCHED_LEVEL).tiles).toEqual(createLevel());
  });

  it('should clear the traps the same way when it is given the same level', () => {
    expect(clearOn(2).tiles).toEqual(clearOn(2).tiles);
  });

  it('should clear the traps another way when the grid is different', () => {
    expect(clearOn(1).tiles[1]).not.toEqual(
      clearOn(1, createLevel(TILE_STONE)).tiles[1],
    );
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(
      clearLevelTraps({
        seed: 'SEED',
        levelNumber: 1,
        levelType: 'HORIZONTAL',
        structures: STRUCTURES,
        tiles: [],
        backTiles: [],
      }).tiles,
    ).toEqual([]);
  });

  it('should pass the seed on when it clears the traps', () => {
    expect(clearOn(1).seed).toBe('SEED');
  });

  it('should pass the level number on when it clears the traps', () => {
    expect(clearOn(3).levelNumber).toBe(3);
  });

  it('should pass the level type on when it clears the traps', () => {
    expect(clearOn(1).levelType).toBe('HORIZONTAL');
  });

  it('should pass the structures on when it clears the traps', () => {
    expect(clearOn(1).structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it clears the traps', () => {
    expect(clearOn(1).backTiles).toBe(BACK_LEVEL);
  });
});
