import {
  TILE_AIR,
  TILE_BRICK,
  TILE_ENEMY,
  TILE_ENEMY_FREEZING,
} from '@mander/model';
import { STRUCTURE_START } from '@mander/structures';
import { describe, expect, it } from 'vitest';

import { isKnown } from './is-known';

const UNKNOWN_TILE = 77;

describe('isKnown', () => {
  it('should accept the cell when it is a hazard, air or a marker', () => {
    expect(isKnown(TILE_ENEMY)).toBe(true);
    expect(isKnown(TILE_AIR)).toBe(true);
    expect(isKnown(TILE_ENEMY_FREEZING)).toBe(true);
    expect(isKnown(STRUCTURE_START)).toBe(true);
  });

  it('should accept the cell when it is a block', () => {
    expect(isKnown(TILE_BRICK)).toBe(true);
  });

  it('should turn the cell away when the game does not know it', () => {
    expect(isKnown(UNKNOWN_TILE)).toBe(false);
  });
});
