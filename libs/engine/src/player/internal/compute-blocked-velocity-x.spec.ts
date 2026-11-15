import { describe, expect, it } from 'vitest';

import { computeBlockedVelocityX } from './compute-blocked-velocity-x';

describe('computeBlockedVelocityX', () => {
  it('should stop the player when a wall blocks the way', () => {
    const velocityX = computeBlockedVelocityX(true, 120);

    expect(velocityX).toBe(0);
  });

  it('should keep the speed of the player when nothing blocks the way', () => {
    const velocityX = computeBlockedVelocityX(false, -120);

    expect(velocityX).toBe(-120);
  });
});
