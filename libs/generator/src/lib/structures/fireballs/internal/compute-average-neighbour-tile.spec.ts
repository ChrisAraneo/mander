import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_STONE,
  TILE_WOOD,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';

describe('computeAverageNeighbourTile', () => {
  it('should take the block that shows up most often when several stand around the spot', () => {
    const tiles = [
      [TILE_AIR, TILE_STONE, TILE_AIR],
      [TILE_DIRT, TILE_FIREBALL, TILE_DIRT],
      [TILE_AIR, TILE_DIRT, TILE_AIR],
    ];

    expect(computeAverageNeighbourTile(tiles, 1, 1)).toBe(TILE_DIRT);
  });

  it('should ignore the empty tiles when it counts the blocks', () => {
    const tiles = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_WOOD, TILE_AIR],
    ];

    expect(computeAverageNeighbourTile(tiles, 1, 1)).toBe(TILE_WOOD);
  });

  it('should never take another fireball when one stands next door', () => {
    const tiles = [
      [TILE_FIREBALL, TILE_FIREBALL, TILE_FIREBALL],
      [TILE_FIREBALL, TILE_FIREBALL, TILE_FIREBALL],
      [TILE_AIR, TILE_STONE, TILE_AIR],
    ];

    expect(computeAverageNeighbourTile(tiles, 1, 1)).toBe(TILE_STONE);
  });

  it('should take the nearest of them when two blocks show up as often', () => {
    const tiles = [
      [TILE_AIR, TILE_STONE, TILE_AIR],
      [TILE_WOOD, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(computeAverageNeighbourTile(tiles, 1, 1)).toBe(TILE_STONE);
  });

  it('should fall back to brick when no block stands around the spot', () => {
    const tiles = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(computeAverageNeighbourTile(tiles, 1, 1)).toBe(TILE_BRICK);
  });

  it('should fall back to brick when the spot sits alone on the grid', () => {
    expect(computeAverageNeighbourTile([[TILE_FIREBALL]], 0, 0)).toBe(
      TILE_BRICK,
    );
  });
});
