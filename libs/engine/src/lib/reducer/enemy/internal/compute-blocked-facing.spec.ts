import { describe, expect, it } from 'vitest';

import { computeBlockedFacing } from './compute-blocked-facing';

describe('computeBlockedFacing', () => {
  it('should turn the enemy to face left when it is blocked while facing right', () => {
    const facing = computeBlockedFacing(true, 1);

    expect(facing).toBe(-1);
  });

  it('should turn the enemy to face right when it is blocked while facing left', () => {
    const facing = computeBlockedFacing(true, -1);

    expect(facing).toBe(1);
  });

  it('should keep the enemy facing right when nothing blocks it', () => {
    const facing = computeBlockedFacing(false, 1);

    expect(facing).toBe(1);
  });

  it('should keep the enemy facing left when nothing blocks it', () => {
    const facing = computeBlockedFacing(false, -1);

    expect(facing).toBe(-1);
  });
});
