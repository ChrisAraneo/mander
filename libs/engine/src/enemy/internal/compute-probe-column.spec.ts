import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { computeProbeColumn } from './compute-probe-column';

const MID_TILE_X = 100;

const MID_TILE_PROBE_COLUMN = 3;

const TILE_EDGE_X = 9;

const TILE_EDGE_PROBE_COLUMN = 1;

const LEFT_EDGE_X = 0;

const BEYOND_THE_LEVEL_COLUMN = -1;

describe('computeProbeColumn', () => {
  it('should look at the column just past the right side of the enemy when it faces right', () => {
    const column = computeProbeColumn(MID_TILE_X, FACING_RIGHT);

    expect(column).toBe(MID_TILE_PROBE_COLUMN);
  });

  it('should look into the next column when the right side of the enemy reaches a tile edge', () => {
    const column = computeProbeColumn(TILE_EDGE_X, FACING_RIGHT);

    expect(column).toBe(TILE_EDGE_PROBE_COLUMN);
  });

  it('should look at the column just past the left side of the enemy when it faces left', () => {
    const column = computeProbeColumn(MID_TILE_X, FACING_LEFT);

    expect(column).toBe(MID_TILE_PROBE_COLUMN);
  });

  it('should look outside the level when the enemy faces left at the left edge', () => {
    const column = computeProbeColumn(LEFT_EDGE_X, FACING_LEFT);

    expect(column).toBe(BEYOND_THE_LEVEL_COLUMN);
  });
});
