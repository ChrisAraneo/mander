import {
  type Layers,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatStructure } from './format-structure';
import { parseStructure } from './parse-structure';

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

describe('parseStructure', () => {
  it('should read the sector back whole when it was painted in both layers', () => {
    expect(parseStructure(formatStructure(TRAP))).toEqual(TRAP);
  });

  it('should keep the hazard and the block behind it apart when both sit on the same tile', () => {
    const read = parseStructure(formatStructure(TRAP));

    expect(read.tiles[0][1]).toBe(TILE_BEARTRAP);
    expect(read.backTiles[0][1]).toBe(TILE_BRICK);
  });

  it('should read the back layer as empty when nothing is painted behind the sector', () => {
    expect(parseStructure(formatStructure(BARE))).toEqual({
      tiles: BARE.tiles,
      backTiles: [],
    });
  });

  it('should read both layers as empty when the text holds no rows', () => {
    expect(parseStructure('')).toEqual({ tiles: [], backTiles: [] });
  });
});
