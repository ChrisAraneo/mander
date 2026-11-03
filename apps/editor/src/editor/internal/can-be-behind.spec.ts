import {
  TILE_AIR,
  TILE_BRICK,
  TILE_CANNON_TRIPLE,
  TILE_SAND,
  TILE_SPIKE,
} from '@mander/model';
import { STRUCTURE_END } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { canBeBehind } from './can-be-behind';

describe('canBeBehind', () => {
  it('should allow the cell behind the level when it is air or a block', () => {
    expect(canBeBehind(TILE_AIR)).toBe(true);
    expect(canBeBehind(TILE_BRICK)).toBe(true);
  });

  it('should not allow the cell behind the level when it is a triple cannon', () => {
    expect(canBeBehind(TILE_CANNON_TRIPLE)).toBe(false);
  });

  it('should not allow the cell behind the level when it is sand', () => {
    expect(canBeBehind(TILE_SAND)).toBe(false);
  });

  it('should not allow the cell behind the level when it is a hazard or a marker', () => {
    expect(canBeBehind(TILE_SPIKE)).toBe(false);
    expect(canBeBehind(STRUCTURE_END)).toBe(false);
  });
});
