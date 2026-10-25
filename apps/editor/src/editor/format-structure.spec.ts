import {
  type Layers,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatStructure } from './format-structure';

const createLayers = (tiles: number[][], backTiles: number[][]): Layers => ({
  tiles,
  backTiles,
});

const TRAP = createLayers(
  [
    [TILE_AIR, TILE_BEARTRAP],
    [TILE_BRICK, TILE_BRICK],
  ],
  [
    [TILE_BRICK, TILE_BRICK],
    [TILE_AIR, TILE_AIR],
  ],
);

const BARE = createLayers(
  [
    [TILE_AIR, TILE_AIR],
    [TILE_BRICK, TILE_BRICK],
  ],
  [
    [TILE_AIR, TILE_AIR],
    [TILE_AIR, TILE_AIR],
  ],
);

describe('formatStructure', () => {
  it('should write the two layers one after the other when the sector is painted in both', () => {
    expect(formatStructure(TRAP)).toBe(
      `[
  [
    [__, BT],
    [BR, BR],
  ],
  [
    [BR, BR],
    [__, __],
  ],
]`,
    );
  });

  it('should write the layer as an empty one when nothing is painted on it', () => {
    expect(formatStructure(BARE)).toBe(
      `[
  [
    [__, __],
    [BR, BR],
  ],
  [],
]`,
    );
  });

  it('should write both layers as empty ones when the sector has no cells', () => {
    expect(formatStructure({ tiles: [], backTiles: [] })).toBe(
      `[
  [],
  [],
]`,
    );
  });
});
