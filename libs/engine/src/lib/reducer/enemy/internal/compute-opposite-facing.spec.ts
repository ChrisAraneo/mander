import { describe, expect, it } from 'vitest';

import { computeOppositeFacing } from './compute-opposite-facing';

describe('computeOppositeFacing', () => {
  it('should face the enemy left when it faces right', () => {
    const facing = computeOppositeFacing(1);

    expect(facing).toBe(-1);
  });

  it('should face the enemy right when it faces left', () => {
    const facing = computeOppositeFacing(-1);

    expect(facing).toBe(1);
  });
});
