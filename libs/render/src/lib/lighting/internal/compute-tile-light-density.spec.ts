import {
  TILE_AIR,
  TILE_CANNON,
  TILE_DIRT,
  TILE_ICE,
  TILE_SPIKE,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { ICE_TILE_LIGHT_DENSITY, SOLID_TILE_LIGHT_DENSITY } from '../consts';
import { computeTileLightDensity } from './compute-tile-light-density';

describe('computeTileLightDensity', () => {
  it('should block the light when the tile is solid ground', () => {
    expect(computeTileLightDensity(TILE_DIRT)).toBe(SOLID_TILE_LIGHT_DENSITY);
  });

  it('should block the light when the tile is a cannon', () => {
    expect(computeTileLightDensity(TILE_CANNON)).toBe(SOLID_TILE_LIGHT_DENSITY);
  });

  it('should let some light through when the tile is ice', () => {
    expect(computeTileLightDensity(TILE_ICE)).toBe(ICE_TILE_LIGHT_DENSITY);
  });

  it('should let the light pass when the tile is air', () => {
    expect(computeTileLightDensity(TILE_AIR)).toBe(0);
  });

  it('should let the light pass when the tile is a spike', () => {
    expect(computeTileLightDensity(TILE_SPIKE)).toBe(0);
  });
});
