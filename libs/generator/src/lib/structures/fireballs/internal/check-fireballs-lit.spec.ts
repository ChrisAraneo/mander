import { TILE_FIREBALL, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIRST_FIREBALL_LEVEL, LAST_FIREBALL_LEVEL } from '../../../consts';
import { checkFireballsLit } from './check-fireballs-lit';

const LEVEL: Tile[][] = [[TILE_FIREBALL]];

describe('checkFireballsLit', () => {
  it('should call the fireballs lit when the level is the fourth', () => {
    expect(
      checkFireballsLit({ tiles: LEVEL, levelNumber: FIRST_FIREBALL_LEVEL })
        .lit,
    ).toBe(true);
  });

  it('should call the fireballs lit when the level is the eighth', () => {
    expect(
      checkFireballsLit({ tiles: LEVEL, levelNumber: LAST_FIREBALL_LEVEL }).lit,
    ).toBe(true);
  });

  it('should call the fireballs out when the level is before the fourth', () => {
    expect(
      checkFireballsLit({ tiles: LEVEL, levelNumber: FIRST_FIREBALL_LEVEL - 1 })
        .lit,
    ).toBe(false);
  });

  it('should call the fireballs out when the level is past the eighth', () => {
    expect(
      checkFireballsLit({ tiles: LEVEL, levelNumber: LAST_FIREBALL_LEVEL + 1 })
        .lit,
    ).toBe(false);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(checkFireballsLit({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });
});
