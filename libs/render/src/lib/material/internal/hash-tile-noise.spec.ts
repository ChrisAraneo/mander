import { describe, expect, it } from 'vitest';

import { hashTileNoise } from './hash-tile-noise';

describe('hashTileNoise', () => {
  it('should give zero when the tile is at the origin', () => {
    const result = hashTileNoise(0, 0);

    expect(result).toBe(0);
  });

  it('should give a fixed value for a tile when it is given its column and plank row', () => {
    const result = hashTileNoise(3, 5);

    expect(result).toBe(2881);
  });

  it('should give another value when the plank row changes', () => {
    const result = hashTileNoise(3, 6);

    expect(result).toBe(7385);
  });

  it('should stay below the modulus when it is given large coordinates', () => {
    const result = hashTileNoise(1000, 2000) < 9973;

    expect(result).toBe(true);
  });
});
