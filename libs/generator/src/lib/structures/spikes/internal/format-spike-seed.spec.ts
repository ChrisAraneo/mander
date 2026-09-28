import { TILE_AIR, TILE_SPIKE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatTilesSeed } from '../../format-tiles-seed';
import { formatSpikeSeed } from './format-spike-seed';

const LEVEL: Tile[][] = [
  [TILE_SPIKE, TILE_AIR],
  [TILE_AIR, TILE_SPIKE],
];

describe('formatSpikeSeed', () => {
  it('should join the level number and the grid', () => {
    expect(formatSpikeSeed(LEVEL, 3)).toBe(`3#${formatTilesSeed(LEVEL)}`);
  });

  it('should give another seed when the level is different', () => {
    expect(formatSpikeSeed(LEVEL, 1)).not.toBe(formatSpikeSeed(LEVEL, 2));
  });
});
