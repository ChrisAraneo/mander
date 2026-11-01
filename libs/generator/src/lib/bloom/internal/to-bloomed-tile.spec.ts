import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_ICEBALL,
  TILE_PINKBALL,
  TILE_SPIKE,
  TILE_STONE,
} from '@mander/model';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toBloomedTile } from './to-bloomed-tile';

describe('toBloomedTile', () => {
  it('should swap the fireball for a pink ball when it is a fireball block', () => {
    expect(toBloomedTile(TILE_FIREBALL)).toBe(TILE_PINKBALL);
  });

  it('should leave the tile alone when it is a block the level is built of', () => {
    expect(map([TILE_DIRT, TILE_BRICK, TILE_STONE], toBloomedTile)).toEqual([
      TILE_DIRT,
      TILE_BRICK,
      TILE_STONE,
    ]);
  });

  it('should leave the tile alone when it is another weapon the player has to face', () => {
    expect(map([TILE_CANNON, TILE_SPIKE], toBloomedTile)).toEqual([
      TILE_CANNON,
      TILE_SPIKE,
    ]);
  });

  it('should leave the tile alone when it is already a pink ball', () => {
    expect(toBloomedTile(TILE_PINKBALL)).toBe(TILE_PINKBALL);
  });

  it('should leave the tile alone when it is an ice ball from another season', () => {
    expect(toBloomedTile(TILE_ICEBALL)).toBe(TILE_ICEBALL);
  });

  it('should leave the tile alone when it is not a block at all', () => {
    expect(toBloomedTile(TILE_AIR)).toBe(TILE_AIR);
  });
});
