import { TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { computeBulletTileCandidates } from './compute-bullet-tile-candidates';

const INSIDE_TILE = 4;
const BOX_SIZE = 8;
const TILE_COLUMN = 2;
const TILE_ROW = 3;

describe('computeBulletTileCandidates', () => {
  it('should name the one tile the box sits in when the box stays inside it', () => {
    const candidates = computeBulletTileCandidates({
      x: TILE_COLUMN * TILE_SIZE + INSIDE_TILE,
      y: TILE_ROW * TILE_SIZE + INSIDE_TILE,
      width: BOX_SIZE,
      height: BOX_SIZE,
    });

    expect(candidates).toEqual([{ x: TILE_COLUMN, y: TILE_ROW }]);
  });

  it('should name both tiles when the box straddles two columns', () => {
    const candidates = computeBulletTileCandidates({
      x: TILE_COLUMN * TILE_SIZE - INSIDE_TILE,
      y: TILE_ROW * TILE_SIZE + INSIDE_TILE,
      width: BOX_SIZE,
      height: BOX_SIZE,
    });

    expect(candidates).toEqual([
      { x: TILE_COLUMN - 1, y: TILE_ROW },
      { x: TILE_COLUMN, y: TILE_ROW },
    ]);
  });

  it('should name the four tiles when the box straddles a corner', () => {
    const candidates = computeBulletTileCandidates({
      x: TILE_COLUMN * TILE_SIZE - INSIDE_TILE,
      y: TILE_ROW * TILE_SIZE - INSIDE_TILE,
      width: BOX_SIZE,
      height: BOX_SIZE,
    });

    expect(candidates).toEqual([
      { x: TILE_COLUMN - 1, y: TILE_ROW - 1 },
      { x: TILE_COLUMN, y: TILE_ROW - 1 },
      { x: TILE_COLUMN - 1, y: TILE_ROW },
      { x: TILE_COLUMN, y: TILE_ROW },
    ]);
  });

  it('should name no tile when the box has no size', () => {
    const candidates = computeBulletTileCandidates({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });

    expect(candidates).toEqual([]);
  });
});
