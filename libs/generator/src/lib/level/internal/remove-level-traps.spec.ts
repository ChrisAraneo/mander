import { createRandom } from '@mander/engine';
import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { filter, flatten, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { removeLevelTraps } from './remove-level-traps';

const TRAPS = 20;

const FIRST_UNTOUCHED_LEVEL = 6;

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const createLevel = (): Tile[][] => [
  times(TRAPS, (): Tile => TILE_SPIKE),
  times(TRAPS, (): Tile => TILE_BEARTRAP),
  times(TRAPS, (): Tile => TILE_DIRT),
];

const countTiles = (tiles: Tile[][], wanted: Tile): number =>
  size(filter(flatten(tiles), (tile) => tile === wanted));

const removeOn = (levelNumber: number, random = createRandom('DAY-1')) =>
  removeLevelTraps({
    levelNumber,
    levelVariant: 'NORMAL',
    levelType: 'HORIZONTAL',
    structures: STRUCTURES,
    tiles: createLevel(),
    backTiles: BACK_LEVEL,
    random,
  });

describe('removeLevelTraps', () => {
  it('should pull every spike and every beartrap when the level is the first', () => {
    const { tiles } = removeOn(1);

    expect(countTiles(tiles, TILE_SPIKE)).toBe(0);
    expect(countTiles(tiles, TILE_BEARTRAP)).toBe(0);
  });

  it('should leave every trap set when the level is the sixth or later', () => {
    expect(removeOn(FIRST_UNTOUCHED_LEVEL).tiles).toEqual(createLevel());
  });

  it('should clear the traps the same way when the generator starts from the same seed', () => {
    expect(removeOn(2).tiles).toEqual(removeOn(2).tiles);
  });

  it('should clear the traps another way when the generator starts from another seed', () => {
    expect(removeOn(2).tiles[1]).not.toEqual(
      removeOn(2, createRandom('DAY-2')).tiles[1],
    );
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(
      removeLevelTraps({
        levelNumber: 1,
        levelVariant: 'NORMAL',
        levelType: 'HORIZONTAL',
        structures: STRUCTURES,
        tiles: [],
        backTiles: [],
        random: createRandom('DAY-1'),
      }).tiles,
    ).toEqual([]);
  });

  it('should pass the generator on when it clears the traps', () => {
    const random = createRandom('DAY-1');

    expect(removeOn(1, random).random).toBe(random);
  });

  it('should pass the level number on when it clears the traps', () => {
    expect(removeOn(3).levelNumber).toBe(3);
  });

  it('should pass the level type on when it clears the traps', () => {
    expect(removeOn(1).levelType).toBe('HORIZONTAL');
  });

  it('should pass the level variant on when it clears the traps', () => {
    expect(removeOn(1).levelVariant).toBe('NORMAL');
  });

  it('should pass the structures on when it clears the traps', () => {
    expect(removeOn(1).structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it clears the traps', () => {
    expect(removeOn(1).backTiles).toBe(BACK_LEVEL);
  });
});
