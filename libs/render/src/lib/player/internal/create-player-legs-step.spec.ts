import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PLAYER_COLORS } from '../consts';
import { createPlayerLegsStep } from './create-player-legs-step';

describe('createPlayerLegsStep', () => {
  it('should draw the swinging legs when the player stands on the ground', () => {
    const calls = drawRecorded(createPlayerLegsStep(true, 3, PLAYER_COLORS));

    expect(calls).toEqual([
      'beginPath()',
      'rect(-5.5, 6, 5, 18)',
      'rect(0.5, 6, 5, 18)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#3F5A86)',
      'fill()',
    ]);
  });

  it('should draw the drawn-up legs when the player is in the air', () => {
    const calls = drawRecorded(createPlayerLegsStep(false, 3, PLAYER_COLORS));

    expect(calls).toEqual([
      'beginPath()',
      'rect(-7, 6, 5, 15)',
      'rect(2, 9, 5, 15)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#3F5A86)',
      'fill()',
    ]);
  });
});
