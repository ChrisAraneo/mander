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

import { getMaterialTint } from './get-material-tint';

describe('getMaterialTint', () => {
  it('should shift brick towards red and lighter when the tile is brick', () => {
    expect(getMaterialTint(TILE_BRICK)).toEqual({
      hue: -20,
      saturation: 2,
      lightness: 16,
    });
  });

  it('should turn stone round the colour wheel and grey it when the tile is stone', () => {
    expect(getMaterialTint(TILE_STONE)).toEqual({
      hue: 183,
      saturation: -22,
      lightness: 19,
    });
  });

  it('should keep wood close to the ground colour when the tile is wood', () => {
    expect(getMaterialTint(TILE_WOOD)).toEqual({
      hue: -4,
      saturation: -4,
      lightness: 16,
    });
  });

  it('should give ceramic a hue of its own when the tile is ceramic', () => {
    expect(getMaterialTint(TILE_CERAMIC)).toEqual({
      hue: 265,
      saturation: -8,
      lightness: 24,
    });
  });

  it('should darken the fireball block when the tile is a fireball block', () => {
    expect(getMaterialTint(TILE_FIREBALL)).toEqual({
      hue: -18,
      saturation: -10,
      lightness: -26,
    });
  });

  it('should leave the colour as it is when the tile is dirt or has no tint of its own', () => {
    expect(getMaterialTint(TILE_DIRT)).toEqual({});
    expect(getMaterialTint(TILE_CANNON)).toEqual({});
  });
});
