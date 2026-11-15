import { describe, expect, it } from 'vitest';

import { computeSubstepDistance } from './compute-substep-distance';

const RIGHTWARD = 1;
const LEFTWARD = -1;
const SHORT_REMAINING = 3;
const LONG_REMAINING = 40;
const SUBSTEP_LIMIT = 8;

describe('computeSubstepDistance', () => {
  it('should cover the whole distance left when it is shorter than one substep', () => {
    const distance = computeSubstepDistance(RIGHTWARD, SHORT_REMAINING);

    expect(distance).toBe(SHORT_REMAINING);
  });

  it('should cover only one substep when more distance is left', () => {
    const distance = computeSubstepDistance(RIGHTWARD, LONG_REMAINING);

    expect(distance).toBe(SUBSTEP_LIMIT);
  });

  it('should go the other way when the direction is backwards', () => {
    const distance = computeSubstepDistance(LEFTWARD, -LONG_REMAINING);

    expect(distance).toBe(-SUBSTEP_LIMIT);
  });

  it('should cover nothing when no distance is left', () => {
    const distance = computeSubstepDistance(RIGHTWARD, 0);

    expect(distance).toBe(0);
  });
});
