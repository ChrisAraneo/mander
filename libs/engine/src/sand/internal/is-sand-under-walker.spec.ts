import {
  type Level,
  type Tile,
  TILE_AIR,
  TILE_DIRT,
  TILE_SAND,
  TILE_SIZE,
} from '@mander/model';
import { head, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { isSandUnderWalker } from './is-sand-under-walker';

const LEGEND: Record<string, Tile> = {
  '.': TILE_AIR,
  '#': TILE_DIRT,
  s: TILE_SAND,
};

const ROWS = ['....', '....', '##ss'];

const LEVEL: Level = {
  seed: 'SEED',
  width: size(head(ROWS)),
  height: size(ROWS),
  tiles: map(ROWS, (row) => map(row, (symbol) => LEGEND[symbol])),
  chestItems: [],
};

const WALKER_WIDTH = 22;

const FLOOR_ROW = 2;

const AIR_ROW = 1;

const SAND_COLUMN = 2;

const DIRT_LEFT = 0;

const SAND_LEFT = SAND_COLUMN * TILE_SIZE;

const FOOTPRINT_OVERHANG = 6;

const BEYOND_THE_LEVEL = 40 * TILE_SIZE;

describe('isSandUnderWalker', () => {
  it('should find sand when the walker stands on a sand block', () => {
    expect(isSandUnderWalker(LEVEL, SAND_LEFT, WALKER_WIDTH, FLOOR_ROW)).toBe(
      true,
    );
  });

  it('should find no sand when the walker stands on another kind of block', () => {
    expect(isSandUnderWalker(LEVEL, DIRT_LEFT, WALKER_WIDTH, FLOOR_ROW)).toBe(
      false,
    );
  });

  it('should find sand when only part of the footprint rests on it', () => {
    expect(
      isSandUnderWalker(
        LEVEL,
        SAND_LEFT - FOOTPRINT_OVERHANG,
        WALKER_WIDTH,
        FLOOR_ROW,
      ),
    ).toBe(true);
  });

  it('should find no sand when the row holds nothing but air', () => {
    expect(isSandUnderWalker(LEVEL, SAND_LEFT, WALKER_WIDTH, AIR_ROW)).toBe(
      false,
    );
  });

  it('should find no sand when the walker stands past the edge of the level', () => {
    expect(
      isSandUnderWalker(LEVEL, BEYOND_THE_LEVEL, WALKER_WIDTH, FLOOR_ROW),
    ).toBe(false);
  });
});
