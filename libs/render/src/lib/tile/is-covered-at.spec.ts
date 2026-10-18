import { type Level, TILE_AIR, TILE_DIRT, TILE_SPIKE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isCoveredAt } from './is-covered-at';

const createLayeredLevel = (
  tiles: number[][],
  backTiles?: number[][],
): Level => ({
  seed: '',
  width: 2,
  height: 2,
  tiles,
  backTiles,
  chestItems: [],
});

const OPEN = [
  [TILE_AIR, TILE_AIR],
  [TILE_AIR, TILE_AIR],
];

describe('isCoveredAt', () => {
  it('should count the tile as covered when a block stands in either layer', () => {
    expect(
      isCoveredAt(
        createLayeredLevel([
          [TILE_DIRT, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(true);
    expect(
      isCoveredAt(
        createLayeredLevel(OPEN, [
          [TILE_AIR, TILE_DIRT],
          [TILE_AIR, TILE_AIR],
        ]),
        1,
        0,
      ),
    ).toBe(true);
  });

  it('should leave a cell open when neither layer fills it', () => {
    expect(
      isCoveredAt(
        createLayeredLevel([
          [TILE_SPIKE, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(false);
  });
});
