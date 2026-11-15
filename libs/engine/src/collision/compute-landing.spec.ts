import { describe, expect, it } from 'vitest';

import { computeLanding } from './compute-landing';

describe('computeLanding', () => {
  it('should ground the player and stop the fall when they fall onto something solid', () => {
    const landing = computeLanding(true, true, false, 120);

    expect(landing).toEqual({ isGrounded: true, velocityY: 0 });
  });

  it('should keep the grounding and stop the climb when the player bumps into something on the way up', () => {
    const landing = computeLanding(true, false, false, -120);

    expect(landing).toEqual({ isGrounded: false, velocityY: 0 });
  });

  it('should keep the player grounded and stopped when they are blocked while standing', () => {
    const landing = computeLanding(true, false, true, 0);

    expect(landing).toEqual({ isGrounded: true, velocityY: 0 });
  });

  it('should leave the player in the air at the same speed when they fall freely', () => {
    const landing = computeLanding(false, true, true, 120);

    expect(landing).toEqual({ isGrounded: false, velocityY: 120 });
  });

  it('should leave the grounding and the speed alone when the player rises freely', () => {
    const landing = computeLanding(false, false, true, -120);

    expect(landing).toEqual({ isGrounded: true, velocityY: -120 });
  });
});
