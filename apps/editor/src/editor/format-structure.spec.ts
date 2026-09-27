import {
  type Layers,
  TILE_AIR,
  TILE_BEARTRAP,
  TILE_BRICK,
} from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatStructure } from './format-structure';
import { parseStructure } from './parse-structure';

const sketch = (tiles: number[][], backTiles: number[][]): Layers => ({
  tiles,
  backTiles,
});

const TRAP = sketch(
  [
    [TILE_AIR, TILE_BEARTRAP],
    [TILE_BRICK, TILE_BRICK],
  ],
  [
    [TILE_BRICK, TILE_BRICK],
    [TILE_AIR, TILE_AIR],
  ],
);

const BARE = sketch(
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
});

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
});
