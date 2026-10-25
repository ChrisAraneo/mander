import { TILE_AIR, TILE_CANNON, TILE_DIRT, TILE_FIREBALL } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { getAlias } from './get-alias';

describe('getAlias', () => {
  it('should return the alias when the cell has one', () => {
    expect(getAlias(TILE_AIR)).toBe('__');
    expect(getAlias(TILE_DIRT)).toBe('DR');
    expect(getAlias(TILE_CANNON)).toBe('CN');
    expect(getAlias(TILE_FIREBALL)).toBe('FB');
  });

  it('should return the number as text when the cell has no alias', () => {
    expect(getAlias(97)).toBe('97');
  });
});
