import { FIXED_STEP_MS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { MAX_STEPS_PER_FRAME } from '../consts';
import { nextCarry } from './next-carry';

describe('nextCarry', () => {
  it('should count the whole steps when the frame took longer than one step', () => {
    expect(nextCarry({ carryMs: 0, steps: 0 }, FIXED_STEP_MS * 2).steps).toBe(
      2,
    );
  });

  it('should carry the leftover time when the frame ends mid-step', () => {
    expect(
      nextCarry({ carryMs: 0, steps: 0 }, FIXED_STEP_MS * 1.5).carryMs,
    ).toBeCloseTo(FIXED_STEP_MS / 2);
  });

  it('should add the time carried from before when it counts the steps', () => {
    expect(
      nextCarry({ carryMs: FIXED_STEP_MS / 2, steps: 0 }, FIXED_STEP_MS / 2)
        .steps,
    ).toBe(1);
  });

  it('should take no more steps than a frame allows when the frame took very long', () => {
    expect(
      nextCarry({ carryMs: 0, steps: 0 }, FIXED_STEP_MS * 1000).steps,
    ).toBe(MAX_STEPS_PER_FRAME);
  });

  it('should take no step when no time has passed', () => {
    expect(nextCarry({ carryMs: 0, steps: 3 }, 0)).toEqual({
      carryMs: 0,
      steps: 0,
    });
  });
});
