import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_ENEMY,
  TILE_FIREBALL,
  TILE_ICE,
  TILE_ICEBALL,
  TILE_SPIKE,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toFrozenTile } from './to-frozen-tile';

describe('toFrozenTile', () => {
  it('should turn the tile to ice when it is a block the level is built of', () => {
    expect(
      map([TILE_BRICK, TILE_STONE, TILE_WOOD, TILE_CERAMIC], toFrozenTile),
    ).toEqual([TILE_ICE, TILE_ICE, TILE_ICE, TILE_ICE]);
  });

  it('should leave the tile alone when it is dirt', () => {
    expect(toFrozenTile(TILE_DIRT)).toBe(TILE_DIRT);
  });

  it('should swap the fireball for an ice ball when it is a fireball block', () => {
    expect(toFrozenTile(TILE_FIREBALL)).toBe(TILE_ICEBALL);
  });

  it('should leave the tile alone when it is a cannon the player has to face', () => {
    expect(toFrozenTile(TILE_CANNON)).toBe(TILE_CANNON);
  });

  it('should leave the tile alone when it is already an ice ball', () => {
    expect(toFrozenTile(TILE_ICEBALL)).toBe(TILE_ICEBALL);
  });

  it('should leave the tile alone when it is already ice', () => {
    expect(toFrozenTile(TILE_ICE)).toBe(TILE_ICE);
  });

  it('should leave the tile alone when it is not a block at all', () => {
    expect(map([TILE_AIR, TILE_SPIKE, TILE_ENEMY], toFrozenTile)).toEqual([
      TILE_AIR,
      TILE_SPIKE,
      TILE_ENEMY,
    ]);
  });
});
