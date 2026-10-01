import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatTilesSeed } from './format-tiles-seed';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_DIRT],
  [TILE_DIRT, TILE_AIR],
];

describe('formatTilesSeed', () => {
  it('should join the tiles of a row with commas and the rows with bars when it writes a grid', () => {
    expect(formatTilesSeed(LEVEL)).toBe(
      `${TILE_AIR},${TILE_DIRT}|${TILE_DIRT},${TILE_AIR}`,
    );
  });

  it('should give the same seed when the grid is the same', () => {
    expect(formatTilesSeed(LEVEL)).toBe(
      formatTilesSeed([
        [TILE_AIR, TILE_DIRT],
        [TILE_DIRT, TILE_AIR],
      ]),
    );
  });

  it('should give another seed when the grid is different', () => {
    expect(formatTilesSeed(LEVEL)).not.toBe(
      formatTilesSeed([
        [TILE_DIRT, TILE_DIRT],
        [TILE_DIRT, TILE_AIR],
      ]),
    );
  });

  it('should give an empty seed when the grid is empty', () => {
    expect(formatTilesSeed([])).toBe('');
  });
});
