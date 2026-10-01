import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createSkyRows } from './create-sky-rows';

const FLOOR: Tile[] = [TILE_DIRT, TILE_AIR, TILE_DIRT];

const LEVEL: Tile[][] = [[TILE_AIR, TILE_AIR, TILE_AIR], FLOOR];

const PADDING = { sky: 2, depth: 3 };

describe('createSkyRows', () => {
  it('should make rows of air as wide as the floor when there is a floor', () => {
    expect(
      createSkyRows({ tiles: LEVEL, padding: PADDING, floor: FLOOR }).sky,
    ).toEqual([
      [TILE_AIR, TILE_AIR, TILE_AIR],
      [TILE_AIR, TILE_AIR, TILE_AIR],
    ]);
  });

  it('should make no rows when the sky height is zero', () => {
    expect(
      createSkyRows({
        tiles: LEVEL,
        padding: { sky: 0, depth: 3 },
        floor: FLOOR,
      }).sky,
    ).toEqual([]);
  });

  it('should make no rows when there is no floor', () => {
    expect(
      createSkyRows({ tiles: [], padding: PADDING, floor: undefined }).sky,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the sky', () => {
    expect(
      createSkyRows({ tiles: LEVEL, padding: PADDING, floor: FLOOR }).tiles,
    ).toBe(LEVEL);
  });

  it('should pass the padding on when it makes the sky', () => {
    expect(
      createSkyRows({ tiles: LEVEL, padding: PADDING, floor: FLOOR }).padding,
    ).toBe(PADDING);
  });

  it('should pass the floor on when it makes the sky', () => {
    expect(
      createSkyRows({ tiles: LEVEL, padding: PADDING, floor: FLOOR }).floor,
    ).toBe(FLOOR);
  });
});
