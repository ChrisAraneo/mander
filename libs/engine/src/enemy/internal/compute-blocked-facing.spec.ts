import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { computeBlockedFacing } from './compute-blocked-facing';

describe('computeBlockedFacing', () => {
  it('should turn the enemy to face left when it is blocked while facing right', () => {
    const facing = computeBlockedFacing(true, FACING_RIGHT);

    expect(facing).toBe(FACING_LEFT);
  });

  it('should turn the enemy to face right when it is blocked while facing left', () => {
    const facing = computeBlockedFacing(true, FACING_LEFT);

    expect(facing).toBe(FACING_RIGHT);
  });

  it('should keep the enemy facing right when nothing blocks it', () => {
    const facing = computeBlockedFacing(false, FACING_RIGHT);

    expect(facing).toBe(FACING_RIGHT);
  });

  it('should keep the enemy facing left when nothing blocks it', () => {
    const facing = computeBlockedFacing(false, FACING_LEFT);

    expect(facing).toBe(FACING_LEFT);
  });
});
