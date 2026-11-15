import { TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeBoxTiles } from './compute-box-tiles';

const BOX_SIZE = 8;

const FIRST_TILE_X = 0;

const FIRST_TILE_Y = 0;

const SECOND_COLUMN_X = TILE_SIZE;

const SECOND_ROW_Y = TILE_SIZE;

const NO_SIZE = 0;

const STRADDLE_OFFSET = TILE_SIZE - BOX_SIZE / 2;

describe('computeBoxTiles', () => {
  it('should give the one tile the box sits in when the box fits inside it', () => {
    const tiles = computeBoxTiles({
      x: FIRST_TILE_X,
      y: FIRST_TILE_Y,
      width: BOX_SIZE,
      height: BOX_SIZE,
    });

    expect(tiles).toEqual([{ x: 0, y: 0 }]);
  });

  it('should give both columns when the box straddles two of them', () => {
    const tiles = computeBoxTiles({
      x: STRADDLE_OFFSET,
      y: FIRST_TILE_Y,
      width: BOX_SIZE,
      height: BOX_SIZE,
    });

    expect(tiles).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ]);
  });

  it('should give the tiles row by row when the box straddles four of them', () => {
    const tiles = computeBoxTiles({
      x: STRADDLE_OFFSET,
      y: STRADDLE_OFFSET,
      width: BOX_SIZE,
      height: BOX_SIZE,
    });

    expect(tiles).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });

  it('should give no tiles when the box has no size', () => {
    const tiles = computeBoxTiles({
      x: SECOND_COLUMN_X,
      y: SECOND_ROW_Y,
      width: NO_SIZE,
      height: NO_SIZE,
    });

    expect(tiles).toEqual([]);
  });
});
