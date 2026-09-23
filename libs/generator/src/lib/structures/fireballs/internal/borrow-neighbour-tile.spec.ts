import {
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_FIREBALL,
  TILE_STONE,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { borrowNeighbourTile } from './borrow-neighbour-tile';

describe('borrowNeighbourTile', () => {
  it('should take the block above when one stands there', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_STONE, TILE_AIR],
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_DIRT, TILE_AIR],
    ];

    expect(borrowNeighbourTile(tiles, 1, 1)).toBe(TILE_STONE);
  });

  it('should look sideways when no block stands above or below', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_DIRT, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(borrowNeighbourTile(tiles, 1, 1)).toBe(TILE_DIRT);
  });

  it('should look at the corners when no block sits straight around', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_STONE, TILE_AIR, TILE_AIR],
    ];

    expect(borrowNeighbourTile(tiles, 1, 1)).toBe(TILE_STONE);
  });

  it('should never take from a fireball when one stands next door', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(borrowNeighbourTile(tiles, 0, 1)).toBe(TILE_BRICK);
  });

  it('should fall back to brick when no block stands anywhere near', () => {
    const tiles: Tile[][] = [
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_FIREBALL, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ];

    expect(borrowNeighbourTile(tiles, 1, 1)).toBe(TILE_BRICK);
  });

  it('should fall back to brick when the spot sits on the edge of the grid', () => {
    expect(borrowNeighbourTile([[TILE_FIREBALL]], 0, 0)).toBe(TILE_BRICK);
  });
});
