import { describe, expect, it } from 'vitest';

import { TILE_BRICK } from '../blocks/tile-brick';
import { TILE_CANNON } from '../blocks/tile-cannon';
import { TILE_CANNON_TRIPLE } from '../blocks/tile-cannon-triple';
import { isCannonTile } from './is-cannon-tile';

describe('isCannonTile', () => {
  it('should say yes when the tile is a regular cannon', () => {
    expect(isCannonTile(TILE_CANNON)).toBe(true);
  });

  it('should say yes when the tile is a triple cannon', () => {
    expect(isCannonTile(TILE_CANNON_TRIPLE)).toBe(true);
  });

  it('should say no when the tile is any other block', () => {
    expect(isCannonTile(TILE_BRICK)).toBe(false);
  });
});
