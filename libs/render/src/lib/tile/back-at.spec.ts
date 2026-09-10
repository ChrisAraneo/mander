import {
  type Level,
  TILE_AIR,
  TILE_BRICK,
  TILE_DIRT,
  TILE_SPIKE,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { backAt } from './back-at';
import { coveredAt } from './covered-at';

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

describe('backAt', () => {
  it('should find the background blocks the back layer holds', () => {
    expect(
      backAt(
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
    expect(backAt(level(OPEN, OPEN), 0, 0)).toBe(false);
  });

  it('should return false for a level built without a back layer', () => {
    expect(backAt(level(OPEN), 0, 0)).toBe(false);
  });

  it('should return false outside the level, which has no back layer to read', () => {
    expect(
      backAt(
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

describe('coveredAt', () => {
  it('should count a block in either layer as cover', () => {
    expect(
      coveredAt(
        level([
          [TILE_DIRT, TILE_AIR],
          [TILE_AIR, TILE_AIR],
        ]),
        0,
        0,
      ),
    ).toBe(true);
    expect(
      coveredAt(
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
      coveredAt(
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
