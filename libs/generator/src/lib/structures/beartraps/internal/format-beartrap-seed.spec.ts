import { TILE_AIR, TILE_BEARTRAP, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatTilesSeed } from '../../format-tiles-seed';
import { formatBeartrapSeed } from './format-beartrap-seed';

const LEVEL: Tile[][] = [
  [TILE_BEARTRAP, TILE_AIR],
  [TILE_AIR, TILE_BEARTRAP],
];

describe('formatBeartrapSeed', () => {
  it('should join the beartrap tag, the level number and the grid', () => {
    expect(formatBeartrapSeed(LEVEL, 3)).toBe(
      `beartrap#3#${formatTilesSeed(LEVEL)}`,
    );
  });

  it('should give another seed when the level is different', () => {
    expect(formatBeartrapSeed(LEVEL, 1)).not.toBe(formatBeartrapSeed(LEVEL, 2));
  });
});
