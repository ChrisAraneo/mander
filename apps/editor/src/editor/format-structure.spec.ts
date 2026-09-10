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
  it('should write the two layers of a sector one after the other', () => {
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

  it('should write a layer with nothing on it as an empty one', () => {
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
  it('should read back a sector painted in both layers', () => {
    expect(parseStructure(formatStructure(TRAP))).toEqual(TRAP);
  });

  it('should keep a hazard and the block behind it apart', () => {
    const read = parseStructure(formatStructure(TRAP));

    expect(read.tiles[0][1]).toBe(TILE_BEARTRAP);
    expect(read.backTiles[0][1]).toBe(TILE_BRICK);
  });

  it('should read a sector with nothing behind it as an empty back layer', () => {
    expect(parseStructure(formatStructure(BARE))).toEqual({
      tiles: BARE.tiles,
      backTiles: [],
    });
  });
});
