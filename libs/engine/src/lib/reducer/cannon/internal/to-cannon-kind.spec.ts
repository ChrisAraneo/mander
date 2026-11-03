import { TILE_CANNON, TILE_CANNON_TRIPLE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { toCannonKind } from './to-cannon-kind';

describe('toCannonKind', () => {
  it('should call it regular when the tile is a regular cannon', () => {
    expect(toCannonKind(TILE_CANNON)).toBe('REGULAR');
  });

  it('should call it triple when the tile is a triple cannon', () => {
    expect(toCannonKind(TILE_CANNON_TRIPLE)).toBe('TRIPLE');
  });
});
