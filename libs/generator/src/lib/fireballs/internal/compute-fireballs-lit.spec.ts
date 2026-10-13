import { TILE_FIREBALL, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { FIRST_FIREBALL_LEVEL, LAST_FIREBALL_LEVEL } from '../../consts';
import { computeFireballsLit } from './compute-fireballs-lit';

const LEVEL: Tile[][] = [[TILE_FIREBALL]];

describe('computeFireballsLit', () => {
  it('should call the fireballs lit when the level is the fourth', () => {
    expect(
      computeFireballsLit({ tiles: LEVEL, levelNumber: FIRST_FIREBALL_LEVEL })
        .lit,
    ).toBe(true);
  });

  it('should call the fireballs lit when the level is the eighth', () => {
    expect(
      computeFireballsLit({ tiles: LEVEL, levelNumber: LAST_FIREBALL_LEVEL })
        .lit,
    ).toBe(true);
  });

  it('should call the fireballs out when the level is before the fourth', () => {
    expect(
      computeFireballsLit({
        tiles: LEVEL,
        levelNumber: FIRST_FIREBALL_LEVEL - 1,
      }).lit,
    ).toBe(false);
  });

  it('should call the fireballs out when the level is past the eighth', () => {
    expect(
      computeFireballsLit({
        tiles: LEVEL,
        levelNumber: LAST_FIREBALL_LEVEL + 1,
      }).lit,
    ).toBe(false);
  });

  it('should keep the grid the same when it reads the level number', () => {
    expect(computeFireballsLit({ tiles: LEVEL, levelNumber: 1 }).tiles).toBe(
      LEVEL,
    );
  });
});
