import {
  PORTAL_HEIGHT,
  TILE_DIRT,
  TILE_PORTAL,
  type Tile,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPortalPatches } from './create-portal-patches';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('createPortalPatches', () => {
  it('should mark the rows above the candidate with portal tiles when there is a candidate', () => {
    expect(
      createPortalPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toEqual([
      { row: 4, column: 2, tile: TILE_PORTAL },
      { row: 3, column: 2, tile: TILE_PORTAL },
    ]);
  });

  it('should make as many marks as the portal height when there is a candidate', () => {
    expect(
      createPortalPatches({
        tiles: LEVEL,
        candidate: { row: 5, column: 2 },
      }).patches,
    ).toHaveLength(PORTAL_HEIGHT);
  });

  it('should make no marks when there is no candidate', () => {
    expect(
      createPortalPatches({ tiles: LEVEL, candidate: undefined }).patches,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(
      createPortalPatches({ tiles: LEVEL, candidate: undefined }).tiles,
    ).toBe(LEVEL);
  });
});
