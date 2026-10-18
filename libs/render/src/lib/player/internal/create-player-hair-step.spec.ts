import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PLAYER_COLORS } from '../consts';
import { createPlayerHairStep } from './create-player-hair-step';

describe('createPlayerHairStep', () => {
  it('should draw the hair clipped to the head when it is given colours', () => {
    const calls = drawRecorded(createPlayerHairStep(PLAYER_COLORS));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'clip()',
      'set fillStyle(#4A3021)',
      'beginPath()',
      'arc(0.5, -17.5, 6.8, 2.9845, 6.346)',
      'fill()',
      'restore()',
    ]);
  });
});
