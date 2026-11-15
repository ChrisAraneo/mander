import { TILE_SIZE } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { SAND_PROBE_DEPTH } from '../consts';
import { computeSandProbeRow } from './compute-sand-probe-row';

const WALKER_HEIGHT = 22;

const FLOOR_ROW = 2;

const FLOOR_Y = FLOOR_ROW * TILE_SIZE - WALKER_HEIGHT;

const TOP_OF_THE_LEVEL_Y = 0;

const DEEP_BELOW_ROW = 40;

describe('computeSandProbeRow', () => {
  it('should give the row just under the feet when the walker stands on the floor', () => {
    expect(computeSandProbeRow(FLOOR_Y, WALKER_HEIGHT)).toBe(FLOOR_ROW);
  });

  it('should give the first row when the walker stands at the top of the level', () => {
    expect(computeSandProbeRow(TOP_OF_THE_LEVEL_Y, WALKER_HEIGHT)).toBe(0);
  });

  it('should give the row the feet have reached when the walker is far below the level', () => {
    expect(computeSandProbeRow(DEEP_BELOW_ROW * TILE_SIZE, WALKER_HEIGHT)).toBe(
      DEEP_BELOW_ROW,
    );
  });

  it('should probe below the feet by the probe depth when the walker stands anywhere', () => {
    expect(computeSandProbeRow(FLOOR_Y, WALKER_HEIGHT)).toBe(
      computeSandProbeRow(FLOOR_Y + SAND_PROBE_DEPTH, WALKER_HEIGHT),
    );
  });
});
