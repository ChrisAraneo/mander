import { describe, expect, it } from 'vitest';

import { TILE_SIZE } from '../../tile/consts';
import { PRONG_HEIGHT } from '../consts';
import { computeProngEdges } from './compute-prong-edges';

const PIXEL_Y = 3 * TILE_SIZE;

describe('computeProngEdges', () => {
  it('should put the base on the top edge and the tip below it when the spike hangs from the ceiling', () => {
    expect(computeProngEdges(PIXEL_Y, 'CEILING')).toEqual({
      base: PIXEL_Y,
      apex: PIXEL_Y + PRONG_HEIGHT,
    });
  });

  it('should put the base on the bottom edge and the tip above it when the spike stands on the floor', () => {
    expect(computeProngEdges(PIXEL_Y, 'FLOOR')).toEqual({
      base: PIXEL_Y + TILE_SIZE,
      apex: PIXEL_Y + TILE_SIZE - PRONG_HEIGHT,
    });
  });

  it('should put the base at zero when the spike hangs from the ceiling of the top row', () => {
    expect(computeProngEdges(0, 'CEILING')).toEqual({
      base: 0,
      apex: PRONG_HEIGHT,
    });
  });
});
