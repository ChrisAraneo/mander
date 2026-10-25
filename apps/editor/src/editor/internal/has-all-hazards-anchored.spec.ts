import {
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_DIRT,
  TILE_SPIKE,
  TILE_SPIKE_CEILING,
  TILE_SPIKE_FALLING,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { hasAllHazardsAnchored } from './has-all-hazards-anchored';

describe('hasAllHazardsAnchored', () => {
  it('should accept the grid when every hazard rests on or hangs from a block', () => {
    expect(
      hasAllHazardsAnchored([
        [TILE_DIRT, TILE_DIRT],
        [TILE_SPIKE_CEILING, TILE_SPIKE_FALLING],
        [TILE_SPIKE, TILE_BEARTRAP],
        [TILE_DIRT, TILE_DIRT],
      ]),
    ).toBe(true);
  });

  it('should turn the grid away when a spike stands on nothing', () => {
    expect(
      hasAllHazardsAnchored([
        [TILE_SPIKE, TILE_AIR],
        [TILE_AIR, TILE_DIRT],
      ]),
    ).toBe(false);
  });

  it('should turn the grid away when a ceiling spike hangs from nothing', () => {
    expect(hasAllHazardsAnchored([[TILE_SPIKE_CEILING]])).toBe(false);
  });

  it('should accept the grid when it is empty', () => {
    expect(hasAllHazardsAnchored([])).toBe(true);
  });
});
