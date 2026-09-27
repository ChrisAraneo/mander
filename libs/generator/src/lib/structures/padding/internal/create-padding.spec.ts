import { TILE_AIR, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPadding } from './create-padding';

const SKY_HEIGHT = 20;

const LEVEL: Tile[][] = [[TILE_AIR]];

describe('createPadding', () => {
  it('should put the sky height on top when it makes the padding', () => {
    expect(createPadding({ tiles: LEVEL, depth: 3 }).padding.sky).toBe(
      SKY_HEIGHT,
    );
  });

  it('should keep the depth it gets when it makes the padding', () => {
    expect(createPadding({ tiles: LEVEL, depth: 3 }).padding.depth).toBe(3);
  });

  it('should still add the sky when no depth is missing', () => {
    expect(createPadding({ tiles: LEVEL, depth: 0 }).padding).toEqual({
      sky: SKY_HEIGHT,
      depth: 0,
    });
  });

  it('should keep the grid the same when it makes the padding', () => {
    expect(createPadding({ tiles: LEVEL, depth: 3 }).tiles).toBe(LEVEL);
  });
});
