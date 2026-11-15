import { describe, expect, it } from 'vitest';

import { computeFacingStep } from './compute-facing-step';
import { FACING_LEFT, FACING_RIGHT } from './consts';

const RIGHTWARD_STEP = 1;

const LEFTWARD_STEP = -1;

describe('computeFacingStep', () => {
  it('should step forward when it faces right', () => {
    expect(computeFacingStep(FACING_RIGHT)).toBe(RIGHTWARD_STEP);
  });

  it('should step back when it faces left', () => {
    expect(computeFacingStep(FACING_LEFT)).toBe(LEFTWARD_STEP);
  });
});
