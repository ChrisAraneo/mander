import { describe, expect, it } from 'vitest';

import { FACING_LEFT, FACING_RIGHT } from '../../facing/consts';
import { computeOppositeFacing } from './compute-opposite-facing';

describe('computeOppositeFacing', () => {
  it('should face the enemy left when it faces right', () => {
    const facing = computeOppositeFacing(FACING_RIGHT);

    expect(facing).toBe(FACING_LEFT);
  });

  it('should face the enemy right when it faces left', () => {
    const facing = computeOppositeFacing(FACING_LEFT);

    expect(facing).toBe(FACING_RIGHT);
  });
});
