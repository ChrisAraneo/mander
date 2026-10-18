import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PLAYER_COLORS } from '../consts';
import { createPlayerEyeStep } from './create-player-eye-step';

describe('createPlayerEyeStep', () => {
  it('should draw an open eye when the player is alive', () => {
    const calls = drawRecorded(createPlayerEyeStep(false, PLAYER_COLORS));

    expect(calls).toEqual([
      'set fillStyle(#1C1C28)',
      'beginPath()',
      'arc(4.2, -15.6, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should draw a crossed-out eye when the player is dying', () => {
    const calls = drawRecorded(createPlayerEyeStep(true, PLAYER_COLORS));

    expect(calls).toEqual([
      'set fillStyle(#1C1C28)',
      'set strokeStyle(#1C1C28)',
      'set lineWidth(1.4)',
      'beginPath()',
      'moveTo(2.4, -17.4)',
      'lineTo(6, -13.8)',
      'moveTo(6, -17.4)',
      'lineTo(2.4, -13.8)',
      'stroke()',
    ]);
  });
});
