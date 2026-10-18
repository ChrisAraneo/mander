import {
  TILE_BRICK,
  TILE_CANNON,
  TILE_CERAMIC,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import {
  BRICK_STYLE,
  CERAMIC_STYLE,
  DIRT_STYLE,
  FIREBALL_STYLE,
  STONE_STYLE,
  WOOD_STYLE,
} from './consts';
import { getMaterialStyle } from './get-material-style';

describe('getMaterialStyle', () => {
  it('should give each material its own hand-picked style when the tile has one', () => {
    expect(getMaterialStyle(TILE_BRICK)).toBe(BRICK_STYLE);
    expect(getMaterialStyle(TILE_STONE)).toBe(STONE_STYLE);
    expect(getMaterialStyle(TILE_WOOD)).toBe(WOOD_STYLE);
    expect(getMaterialStyle(TILE_CERAMIC)).toBe(CERAMIC_STYLE);
    expect(getMaterialStyle(TILE_FIREBALL)).toBe(FIREBALL_STYLE);
  });

  it('should give the dirt style when the tile is dirt', () => {
    expect(getMaterialStyle(TILE_DIRT)).toBe(DIRT_STYLE);
  });

  it('should fall back to the dirt style when the tile has no style of its own', () => {
    expect(getMaterialStyle(TILE_CANNON)).toBe(DIRT_STYLE);
  });
});
