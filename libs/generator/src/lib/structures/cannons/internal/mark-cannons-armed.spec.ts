import { TILE_CANNON, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIRST_CANNON_LEVEL } from '../../../consts';
import { markCannonsArmed } from './mark-cannons-armed';

const LEVEL: Tile[][] = [[TILE_CANNON]];

describe('markCannonsArmed', () => {
  it('should call the cannons armed when the level is the fifth', () => {
    expect(
      markCannonsArmed({ tiles: LEVEL, levelNumber: FIRST_CANNON_LEVEL }).armed,
    ).toBe(true);
  });

  it('should call the cannons armed when the level is past the fifth', () => {
    expect(
      markCannonsArmed({ tiles: LEVEL, levelNumber: FIRST_CANNON_LEVEL + 3 })
        .armed,
    ).toBe(true);
  });

  it('should call the cannons cold when the level is before the fifth', () => {
    expect(
      markCannonsArmed({ tiles: LEVEL, levelNumber: FIRST_CANNON_LEVEL - 1 })
        .armed,
    ).toBe(false);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(markCannonsArmed({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });
});
