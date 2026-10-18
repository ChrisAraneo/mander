import { describe, expect, it } from 'vitest';

import { computeTotalTime } from './compute-total-time';

describe('computeTotalTime', () => {
  it('should add up the times of every level when several levels are done', () => {
    const total = computeTotalTime([12.5, 30, 7.25]);

    expect(total).toBe(49.75);
  });

  it('should give the time of the level when only one level is done', () => {
    const total = computeTotalTime([42]);

    expect(total).toBe(42);
  });

  it('should give no time when no level is done yet', () => {
    const total = computeTotalTime([]);

    expect(total).toBe(0);
  });
});
