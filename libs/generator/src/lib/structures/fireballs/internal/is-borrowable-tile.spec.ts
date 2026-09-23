import { TILE_AIR, TILE_DIRT, TILE_FIREBALL, TILE_GEM } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isBorrowableTile } from './is-borrowable-tile';

describe('isBorrowableTile', () => {
  it('should lend the tile when it is a block', () => {
    expect(isBorrowableTile(TILE_DIRT)).toBe(true);
  });

  it('should keep the tile when it is empty', () => {
    expect(isBorrowableTile(TILE_AIR)).toBe(false);
  });

  it('should keep the tile when it is a pickup', () => {
    expect(isBorrowableTile(TILE_GEM)).toBe(false);
  });

  it('should keep the tile when it is another fireball', () => {
    expect(isBorrowableTile(TILE_FIREBALL)).toBe(false);
  });

  it('should keep the tile when it is off the grid', () => {
    expect(isBorrowableTile(undefined)).toBe(false);
  });
});
