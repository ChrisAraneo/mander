import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createPlayerGroundedLegsStep } from './create-player-grounded-legs-step';

describe('createPlayerGroundedLegsStep', () => {
  it('should trace both legs side by side when the player is not swinging them', () => {
    const calls = drawRecorded(createPlayerGroundedLegsStep(0));

    expect(calls).toEqual(['rect(-7, 6, 5, 18)', 'rect(2, 6, 5, 18)']);
  });

  it('should trace the legs apart when the player swings them', () => {
    const calls = drawRecorded(createPlayerGroundedLegsStep(3));

    expect(calls).toEqual(['rect(-5.5, 6, 5, 18)', 'rect(0.5, 6, 5, 18)']);
  });
});
