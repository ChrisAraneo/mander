import { describe, expect, it } from 'vitest';

import { computeProbeColumn } from './compute-probe-column';

describe('computeProbeColumn', () => {
  it('should look at the column just past the right side of the enemy when it faces right', () => {
    const column = computeProbeColumn(100, 1);

    expect(column).toBe(3);
  });

  it('should look into the next column when the right side of the enemy reaches a tile edge', () => {
    const column = computeProbeColumn(9, 1);

    expect(column).toBe(1);
  });

  it('should look at the column just past the left side of the enemy when it faces left', () => {
    const column = computeProbeColumn(100, -1);

    expect(column).toBe(3);
  });

  it('should look outside the level when the enemy faces left at the left edge', () => {
    const column = computeProbeColumn(0, -1);

    expect(column).toBe(-1);
  });
});
