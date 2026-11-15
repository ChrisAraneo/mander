import { describe, expect, it } from 'vitest';

import { computeProbeRows } from './compute-probe-rows';

describe('computeProbeRows', () => {
  it('should look at a single row when the enemy stands inside one row', () => {
    const rows = computeProbeRows(74);

    expect(rows).toEqual([2]);
  });

  it('should look at both rows when the enemy spans two rows', () => {
    const rows = computeProbeRows(20);

    expect(rows).toEqual([0, 1]);
  });
});
