import { TILE_AIR, TILE_CANNON, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findCannonCells } from './find-cannon-cells';

const LEVEL = [
  [TILE_AIR, TILE_CANNON],
  [TILE_CANNON, TILE_DIRT],
];

describe('findCannonCells', () => {
  it('should give the spot of every cannon when they are cold', () => {
    expect(findCannonCells({ tiles: LEVEL, armed: false }).cells).toEqual([
      { row: 0, column: 1 },
      { row: 1, column: 0 },
    ]);
  });

  it('should give no spots when the cannons are armed', () => {
    expect(findCannonCells({ tiles: LEVEL, armed: true }).cells).toEqual([]);
  });

  it('should give no spots when the grid holds no cannon', () => {
    expect(
      findCannonCells({ tiles: [[TILE_DIRT]], armed: false }).cells,
    ).toEqual([]);
  });

  it('should give no spots when the grid is empty', () => {
    expect(findCannonCells({ tiles: [], armed: false }).cells).toEqual([]);
  });

  it('should keep the grid the same when it looks for cannons', () => {
    expect(findCannonCells({ tiles: LEVEL, armed: false }).tiles).toBe(LEVEL);
  });
});
