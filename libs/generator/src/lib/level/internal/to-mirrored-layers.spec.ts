import { TILE_AIR, TILE_BRICK, TILE_DIRT, type Tile } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { toMirroredLayers } from './to-mirrored-layers';

const createFront = (): Tile[][] => [[TILE_DIRT, TILE_AIR]];

const createBack = (): Tile[][] => [[TILE_AIR, TILE_BRICK]];

describe('toMirroredLayers', () => {
  it('should turn the front layer around when it mirrors the layers', () => {
    expect(toMirroredLayers(createFront(), createBack()).tiles).toEqual([
      [TILE_AIR, TILE_DIRT],
    ]);
  });

  it('should turn the back layer around when it mirrors the layers', () => {
    expect(toMirroredLayers(createFront(), createBack()).backTiles).toEqual([
      [TILE_BRICK, TILE_AIR],
    ]);
  });

  it('should give back two empty layers when both layers are empty', () => {
    expect(toMirroredLayers([], [])).toEqual({ tiles: [], backTiles: [] });
  });

  it('should not change the old grids when it mirrors the layers', () => {
    const tiles = createFront();
    const backTiles = createBack();

    toMirroredLayers(tiles, backTiles);

    expect(tiles).toEqual(createFront());
    expect(backTiles).toEqual(createBack());
  });
});
