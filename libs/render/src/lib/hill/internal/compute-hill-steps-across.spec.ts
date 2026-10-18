import { describe, expect, it } from 'vitest';

import { computeHillStepsAcross } from './compute-hill-steps-across';

describe('computeHillStepsAcross', () => {
  it('should sample the hill every sixteen pixels up to the far edge when the view is a whole number of steps wide', () => {
    const result = computeHillStepsAcross(64);

    expect(result).toEqual([0, 16, 32, 48, 64]);
  });

  it('should still sample the near edge when the view is narrower than one step', () => {
    const result = computeHillStepsAcross(10);

    expect(result).toEqual([0]);
  });
});
