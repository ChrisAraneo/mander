import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_DIRT,
  TILE_STONE,
  TILE_WOOD,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { averageNeighbourTile } from './average-neighbour-tile';

describe('averageNeighbourTile', () => {
  it('should take the block that shows up most often when several stand around the spot', () => {
    const tiles: Tile[][] = [
      [TILE_DIRT, TILE_DIRT, TILE_STONE],
      [TILE_DIRT, TILE_CANNON, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(averageNeighbourTile(tiles, 1, 1)).toBe(TILE_DIRT);
  });

  it('should ignore the empty tiles when it counts the blocks', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_CANNON, TILE_AIR],
      [TILE_AIR, TILE_WOOD, TILE_AIR],
    ];

    expect(averageNeighbourTile(tiles, 1, 1)).toBe(TILE_WOOD);
  });

  it('should never take another cannon when one stands next door', () => {
    const tiles: Tile[][] = [
      [TILE_CANNON, TILE_CANNON, TILE_CANNON],
      [TILE_CANNON, TILE_CANNON, TILE_CANNON],
      [TILE_AIR, TILE_STONE, TILE_AIR],
    ];

    expect(averageNeighbourTile(tiles, 1, 1)).toBe(TILE_STONE);
  });

  it('should take the nearest of them when two blocks show up as often', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_STONE, TILE_AIR],
      [TILE_WOOD, TILE_CANNON, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(averageNeighbourTile(tiles, 1, 1)).toBe(TILE_STONE);
  });

  it('should fall back to brick when no block stands around the spot', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_CANNON, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(averageNeighbourTile(tiles, 1, 1)).toBe(TILE_BRICK);
  });

  it('should fall back to brick when the spot sits alone on the grid', () => {
    expect(averageNeighbourTile([[TILE_CANNON]], 0, 0)).toBe(TILE_BRICK);
  });
});
