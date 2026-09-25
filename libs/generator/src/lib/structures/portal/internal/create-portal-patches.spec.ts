import { TILE_DIRT, TILE_PORTAL, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createPortalPatches } from './create-portal-patches';

const LEVEL: Tile[][] = [[TILE_DIRT]];

describe('createPortalPatches', () => {
  it('should mark each row with a portal tile when a spot was found', () => {
    expect(
      createPortalPatches({
        tiles: LEVEL,
        found: { column: 2, rows: [3, 4] },
      }).patches,
    ).toEqual([
      { row: 3, column: 2, tile: TILE_PORTAL },
      { row: 4, column: 2, tile: TILE_PORTAL },
    ]);
  });

  it('should use the same column for every mark when a spot was found', () => {
    expect(
      createPortalPatches({
        tiles: LEVEL,
        found: { column: 7, rows: [1, 0] },
      }).patches,
    ).toEqual([
      { row: 1, column: 7, tile: TILE_PORTAL },
      { row: 0, column: 7, tile: TILE_PORTAL },
    ]);
  });

  it('should make no marks when no spot was found', () => {
    expect(
      createPortalPatches({ tiles: LEVEL, found: undefined }).patches,
    ).toEqual([]);
  });

  it('should make no marks when the spot has no rows', () => {
    expect(
      createPortalPatches({ tiles: LEVEL, found: { column: 1, rows: [] } })
        .patches,
    ).toEqual([]);
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createPortalPatches({ tiles: LEVEL, found: undefined }).tiles).toBe(
      LEVEL,
    );
  });
});
