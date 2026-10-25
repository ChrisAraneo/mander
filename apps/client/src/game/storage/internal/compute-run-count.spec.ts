import { describe, expect, it } from 'vitest';

import { computeRunCount } from './compute-run-count';

describe('computeRunCount', () => {
  it('should count one more run when the world was played before', () => {
    expect(
      computeRunCount({
        name: 'ABC',
        day: '2026-09-04',
        playedAt: 'NOW',
        runs: 3,
      }),
    ).toBe(4);
  });

  it('should count the first run when the world was never played', () => {
    expect(computeRunCount(undefined)).toBe(1);
  });
});
