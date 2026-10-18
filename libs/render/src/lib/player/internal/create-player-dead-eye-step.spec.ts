import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PLAYER_COLORS } from '../consts';
import { createPlayerDeadEyeStep } from './create-player-dead-eye-step';

describe('createPlayerDeadEyeStep', () => {
  it('should cross out the eye in the eye colour when it is given colours', () => {
    const calls = drawRecorded(createPlayerDeadEyeStep(PLAYER_COLORS));

    expect(calls).toEqual([
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
