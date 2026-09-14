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
  it('should find the background blocks the back layer holds', () => {
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

  it('should return false where the back layer is empty', () => {
    expect(isBackAt(level(OPEN, OPEN), 0, 0)).toBe(false);
  });

  it('should return false for a level built without a back layer', () => {
    expect(isBackAt(level(OPEN), 0, 0)).toBe(false);
  });

  it('should return false outside the level, which has no back layer to read', () => {
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
  it('should count a block in either layer as cover', () => {
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
