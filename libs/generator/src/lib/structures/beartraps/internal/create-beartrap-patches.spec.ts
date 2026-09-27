import { TILE_AIR, TILE_BEARTRAP, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createBeartrapPatches } from './create-beartrap-patches';

const LEVEL: Tile[][] = [[TILE_BEARTRAP, TILE_BEARTRAP]];

describe('createBeartrapPatches', () => {
  it('should mark the spots with air when it gets spots', () => {
    expect(
      createBeartrapPatches({
        tiles: LEVEL,
        cells: [
          { row: 0, column: 0 },
          { row: 0, column: 1 },
        ],
      }).patches,
    ).toEqual([
      { row: 0, column: 0, tile: TILE_AIR },
      { row: 0, column: 1, tile: TILE_AIR },
    ]);
  });

  it('should make no marks when it gets no spots', () => {
    expect(createBeartrapPatches({ tiles: LEVEL, cells: [] }).patches).toEqual(
      [],
    );
  });

  it('should keep the grid the same when it makes the marks', () => {
    expect(createBeartrapPatches({ tiles: LEVEL, cells: [] }).tiles).toBe(
      LEVEL,
    );
  });
});
