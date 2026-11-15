import { describe, expect, it } from 'vitest';

import { computeBlockedPosition } from './compute-blocked-position';

describe('computeBlockedPosition', () => {
  it('should put the box flush against the left side of the tile it reached when it moves right', () => {
    const position = computeBlockedPosition(54, 1, 16);

    expect(position).toBe(48);
  });

  it('should put a narrow box flush against the left side of the tile it reached when it moves right', () => {
    const position = computeBlockedPosition(100, 1, 10);

    expect(position).toBe(86);
  });

  it('should put the box flush against the right side of the tile it reached when it moves left', () => {
    const position = computeBlockedPosition(60, -1, 16);

    expect(position).toBe(64);
  });

  it('should put the box at the start of the next tile when it does not move', () => {
    const position = computeBlockedPosition(10, 0, 16);

    expect(position).toBe(32);
  });
});
