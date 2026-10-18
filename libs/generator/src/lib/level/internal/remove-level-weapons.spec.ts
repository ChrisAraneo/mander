import { createRandom } from '@mander/engine';
import {
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_FIREBALL,
  type Tile,
} from '@mander/model';
import type { Sector } from '@mander/structures';
import { flatten, includes } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FIRST_CANNON_LEVEL, FIRST_FIREBALL_LEVEL } from '../../consts';
import { removeLevelWeapons } from './remove-level-weapons';

const RANDOM = createRandom('SEED');

const STRUCTURES: Sector[] = [];

const BACK_LEVEL: Tile[][] = [[TILE_AIR]];

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_CANNON, TILE_FIREBALL],
  [TILE_DIRT, TILE_DIRT, TILE_DIRT],
];

const removeOn = (levelNumber: number) =>
  removeLevelWeapons({
    levelNumber,
    levelType: 'HORIZONTAL',
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
    const tiles = flatten(removeOn(FIRST_FIREBALL_LEVEL).tiles);

    expect(includes(tiles, TILE_CANNON)).toBe(false);
    expect(includes(tiles, TILE_FIREBALL)).toBe(true);
  });

  it('should leave both weapons standing when the level arms them', () => {
    expect(removeOn(FIRST_CANNON_LEVEL).tiles).toEqual(createLevel());
  });

  it('should give back an empty grid when the grid is empty', () => {
    expect(
      removeLevelWeapons({
        levelNumber: 1,
        levelType: 'HORIZONTAL',
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

  it('should pass the structures on when it clears the weapons', () => {
    expect(removeOn(1).structures).toBe(STRUCTURES);
  });

  it('should keep the back layer the same when it clears the weapons', () => {
    expect(removeOn(1).backTiles).toBe(BACK_LEVEL);
  });
});
