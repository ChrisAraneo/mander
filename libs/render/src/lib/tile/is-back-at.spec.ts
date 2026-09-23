import {
  type Level,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isBackAt } from './is-back-at';
import { isCoveredAt } from './is-covered-at';

const level = (tiles: number[][], backTiles?: number[][]): Level => ({
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
        level(OPEN, [
          [TILE_BRICK, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(true);
  });

  it('should return false when the back layer is empty', () => {
    expect(isBackAt(level(OPEN, OPEN), 0, 0)).toBe(false);
  });

  it('should return false when the level was built without a back layer', () => {
    expect(isBackAt(level(OPEN), 0, 0)).toBe(false);
  });

  it('should return false when the coordinates lie outside the level', () => {
    expect(
      isBackAt(
        level(OPEN, [
          [TILE_BRICK, TILE_BRICK],
          [TILE_BRICK, TILE_BRICK],
        ]),
        -1,
        0,
      ),
    ).toBe(false);
  });
});

describe('isCoveredAt', () => {
  it('should count the tile as covered when a block stands in either layer', () => {
    expect(
      isCoveredAt(
        level([
          [TILE_DIRT, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(true);
    expect(
      isCoveredAt(
        level(OPEN, [
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
        level([
          [TILE_SPIKE, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(false);
  });
});
