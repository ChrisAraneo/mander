import { describe, expect, it } from 'vitest';

import { getSweepSize } from './get-sweep-size';
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

describe('getSweepSize', () => {
  it('should give the width of the box when it moves sideways', () => {
    expect(getSweepSize(createSweep('HORIZONTAL'))).toBe(30);
  });

  it('should give the height of the box when it moves up or down', () => {
    expect(getSweepSize(createSweep('VERTICAL'))).toBe(40);
  });
});
