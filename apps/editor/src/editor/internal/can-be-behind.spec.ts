import { TILE_AIR, TILE_BRICK, TILE_SPIKE } from '@mander/model';
import { STRUCTURE_END } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { canBeBehind } from './can-be-behind';

describe('canBeBehind', () => {
  it('should allow the cell behind the level when it is air or a block', () => {
    expect(canBeBehind(TILE_AIR)).toBe(true);
    expect(canBeBehind(TILE_BRICK)).toBe(true);
  });

  it('should not allow the cell behind the level when it is a hazard or a marker', () => {
    expect(canBeBehind(TILE_SPIKE)).toBe(false);
    expect(canBeBehind(STRUCTURE_END)).toBe(false);
  });
});
