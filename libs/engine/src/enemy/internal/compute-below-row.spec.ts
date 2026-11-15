import { describe, expect, it } from 'vitest';

import { computeBelowRow } from './compute-below-row';

describe('computeBelowRow', () => {
  it('should pick the top row when the enemy stands high inside it', () => {
    const row = computeBelowRow(0);

    expect(row).toBe(0);
  });

  it('should pick the next row down when the enemy reaches down into it', () => {
    const row = computeBelowRow(10);

    expect(row).toBe(1);
  });
});
