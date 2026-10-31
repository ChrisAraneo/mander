import { createRandom } from '@mander/engine';
import {
  type Season,
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_FIREBALL,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { flatten, includes } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { removeLevelWeapons } from './remove-level-weapons';

const FIRST_LIT_LEVEL = 5;

const FIRST_ARMED_LEVEL = 6;

const RANDOM = createRandom('SEED');

const SPRING: Season = 'SPRING';

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_CANNON, TILE_FIREBALL],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const removeOn = (levelNumber: number) =>
  removeLevelWeapons({
    levelNumber,
    levelVariant: 'NORMAL',
    levelType: 'HORIZONTAL',
    season: SPRING,
    structures: STRUCTURES,
    tiles: createLevel(),
    backTiles: BACK_LEVEL,
    random: RANDOM,
  });

describe('removeLevelWeapons', () => {
  it('should put the cannons and the fireballs out when the level arms neither', () => {
    const tiles = flatten(removeOn(1).tiles);

    expect(includes(tiles, TILE_CANNON)).toBe(false);
    expect(includes(tiles, TILE_FIREBALL)).toBe(false);
  });

  it('should leave the fireballs burning and put the cannons out when the level lights fireballs only', () => {
    const tiles = flatten(removeOn(FIRST_LIT_LEVEL).tiles);

    expect(includes(tiles, TILE_CANNON)).toBe(false);
    expect(includes(tiles, TILE_FIREBALL)).toBe(true);
  });

  it('should leave both weapons standing when the level arms them', () => {
    expect(removeOn(FIRST_ARMED_LEVEL).tiles).toEqual(createLevel());
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(
      removeLevelWeapons({
        levelNumber: 1,
        levelVariant: 'NORMAL',
        levelType: 'HORIZONTAL',
        season: SPRING,
        structures: STRUCTURES,
        tiles: [],
        backTiles: [],
        random: RANDOM,
      }).tiles,
    ).toEqual([]);
  });

  it('should pass the generator on when it clears the weapons', () => {
    expect(removeOn(1).random).toBe(RANDOM);
  });

  it('should pass the level number on when it clears the weapons', () => {
    expect(removeOn(3).levelNumber).toBe(3);
  });

  it('should pass the level type on when it clears the weapons', () => {
    expect(removeOn(1).levelType).toBe('HORIZONTAL');
  });

  it('should pass the level variant on when it clears the weapons', () => {
    expect(removeOn(1).levelVariant).toBe('NORMAL');
  });

  it('should pass the season on when it clears the weapons', () => {
    expect(removeOn(1).season).toBe(SPRING);
  });

  it('should pass the structures on when it clears the weapons', () => {
    expect(removeOn(1).structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it clears the weapons', () => {
    expect(removeOn(1).backTiles).toBe(BACK_LEVEL);
  });
});
