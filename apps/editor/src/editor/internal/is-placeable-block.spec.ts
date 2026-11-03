import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON,
  TILE_CANNON_TRIPLE,
  TILE_SAND,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isPlaceableBlock } from './is-placeable-block';

describe('isPlaceableBlock', () => {
  it('should accept the cell when it is a block', () => {
    expect(isPlaceableBlock(TILE_BRICK)).toBe(true);
  });

  it('should accept the cell when it is a regular cannon', () => {
    expect(isPlaceableBlock(TILE_CANNON)).toBe(true);
  });

  it('should turn the cell away when it is a triple cannon', () => {
    expect(isPlaceableBlock(TILE_CANNON_TRIPLE)).toBe(false);
  });

  it('should turn the cell away when it is sand', () => {
    expect(isPlaceableBlock(TILE_SAND)).toBe(false);
  });

  it('should turn the cell away when it is not a block', () => {
    expect(isPlaceableBlock(TILE_AIR)).toBe(false);
  });
});
