import { TILE_AIR, TILE_BEARTRAP, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchBeartrapTiles } from './patch-beartrap-tiles';

const createLevel = (): Tile[][] => [
  [TILE_BEARTRAP, TILE_BEARTRAP],
  [TILE_DIRT, TILE_DIRT],
];

describe('patchBeartrapTiles', () => {
  it('should lift the traps out when it gets marks', () => {
    expect(
      patchBeartrapTiles({
        tiles: createLevel(),
        patches: [{ row: 0, column: 1, tile: TILE_AIR }],
      }),
    ).toEqual([
      [TILE_BEARTRAP, TILE_AIR],
      [TILE_DIRT, TILE_DIRT],
    ]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchBeartrapTiles({ tiles: createLevel(), patches: [] })).toEqual(
      createLevel(),
    );
  });

  it('should not change the old grid when it lifts a trap', () => {
    const tiles = createLevel();

    patchBeartrapTiles({
      tiles,
      patches: [{ row: 0, column: 0, tile: TILE_AIR }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
