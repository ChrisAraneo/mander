import { TILE_AIR, TILE_FIREBALL, TILE_STONE, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { patchFireballTiles } from './patch-fireball-tiles';

const createLevel = (): Tile[][] => [
  [TILE_AIR, TILE_STONE],
  [TILE_AIR, TILE_FIREBALL],
];

describe('patchFireballTiles', () => {
  it('should put out the fireballs when it gets marks', () => {
    expect(
      patchFireballTiles({
        tiles: createLevel(),
        patches: [{ row: 1, column: 1, tile: TILE_STONE }],
      }),
    ).toEqual([
      [TILE_AIR, TILE_STONE],
      [TILE_AIR, TILE_STONE],
    ]);
  });

  it('should give back the same grid when it gets no marks', () => {
    expect(patchFireballTiles({ tiles: createLevel(), patches: [] })).toEqual(
      createLevel(),
    );
  });

  it('should not change the old grid when it puts out a fireball', () => {
    const tiles = createLevel();

    patchFireballTiles({
      tiles,
      patches: [{ row: 1, column: 1, tile: TILE_STONE }],
    });

    expect(tiles).toEqual(createLevel());
  });
});
