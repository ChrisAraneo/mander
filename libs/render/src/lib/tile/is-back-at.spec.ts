import { type Level, TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isBackAt } from './is-back-at';

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

describe('isBackAt', () => {
  it('should find the background block when the back layer holds one', () => {
    expect(
      isBackAt(
        createLayeredLevel(OPEN, [
          [TILE_BRICK, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(true);
  });

  it('should return false when the back layer is empty', () => {
    expect(isBackAt(createLayeredLevel(OPEN, OPEN), 0, 0)).toBe(false);
  });

  it('should return false when the level was built without a back layer', () => {
    expect(isBackAt(createLayeredLevel(OPEN), 0, 0)).toBe(false);
  });

  it('should return false when the coordinates lie outside the level', () => {
    expect(
      isBackAt(
        createLayeredLevel(OPEN, [
          [TILE_BRICK, TILE_BRICK],
          [TILE_BRICK, TILE_BRICK],
        ]),
        -1,
        0,
      ),
    ).toBe(false);
  });
});
