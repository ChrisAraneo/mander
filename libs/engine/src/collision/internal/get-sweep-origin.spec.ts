import { describe, expect, it } from 'vitest';

import { getSweepOrigin } from './get-sweep-origin';
import type { Sweep } from './types/sweep';

const createSweep = (axis: Sweep['axis']): Sweep => ({
  axis,
  level: { seed: 'SEED', width: 0, height: 0, tiles: [], chestItems: [] },
  originX: 10,
  originY: 20,
  width: 30,
  height: 40,
  delta: 5,
});

describe('getSweepOrigin', () => {
  it('should give the left of the box when it moves sideways', () => {
    expect(getSweepOrigin(createSweep('HORIZONTAL'))).toBe(10);
  });

  it('should give the top of the box when it moves up or down', () => {
    expect(getSweepOrigin(createSweep('VERTICAL'))).toBe(20);
  });
});
