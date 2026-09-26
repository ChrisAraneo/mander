import { TILE_AIR, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findFloorRow } from './find-floor-row';

const LEVEL: Tile[][] = [
  [TILE_AIR, TILE_AIR],
  [TILE_DIRT, TILE_AIR],
];

const PADDING = { sky: 2, depth: 3 };

describe('findFloorRow', () => {
  it('should give the bottom row when the grid has rows', () => {
    expect(findFloorRow({ tiles: LEVEL, padding: PADDING }).floor).toBe(
      LEVEL[1],
    );
  });

  it('should give nothing when the grid is empty', () => {
    expect(findFloorRow({ tiles: [], padding: PADDING }).floor).toBeUndefined();
  });

  it('should keep the grid the same when it finds the floor', () => {
    expect(findFloorRow({ tiles: LEVEL, padding: PADDING }).tiles).toBe(LEVEL);
  });

  it('should keep the padding the same when it finds the floor', () => {
    expect(findFloorRow({ tiles: LEVEL, padding: PADDING }).padding).toBe(
      PADDING,
    );
  });
});
