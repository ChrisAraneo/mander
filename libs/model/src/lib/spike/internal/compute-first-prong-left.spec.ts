import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../../tile/consts';
import { PRONG_PITCH, PRONG_WIDTH, SPIKE_PRONGS } from '../consts';
import { computeFirstProngLeft } from './compute-first-prong-left';

const PIXEL_X = 4 * TILE_SIZE;

describe('computeFirstProngLeft', () => {
  it('should leave the same gap on both sides of the tile when the spike is a strip', () => {
    const left = computeFirstProngLeft(PIXEL_X, SPIKE_PRONGS);
    const right = left + (SPIKE_PRONGS - 1) * PRONG_PITCH + PRONG_WIDTH;

    expect(left - PIXEL_X).toBeCloseTo(PIXEL_X + TILE_SIZE - right, 6);
    expect(left).toBeCloseTo(130.5, 6);
  });

  it('should put the prong in the middle of the tile when there is one prong', () => {
    const left = computeFirstProngLeft(PIXEL_X, 1);

    expect(left + PRONG_WIDTH / 2).toBeCloseTo(PIXEL_X + TILE_SIZE / 2, 6);
  });

  it('should give the gap alone when the tile starts at zero', () => {
    const left = computeFirstProngLeft(0, 1);

    expect(left).toBeCloseTo((TILE_SIZE - PRONG_WIDTH) / 2, 6);
  });
});
