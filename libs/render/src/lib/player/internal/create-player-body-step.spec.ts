import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PLAYER_COLORS } from '../consts';
import { createPlayerBodyStep } from './create-player-body-step';

describe('createPlayerBodyStep', () => {
  it('should draw the body with the strap in the middle when the player is not swinging', () => {
    const calls = drawRecorded(createPlayerBodyStep(0, PLAYER_COLORS));

    expect(calls).toEqual([
      'beginPath()',
      'roundRect(-8, -9, 16, 19, 5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F4762C)',
      'fill()',
      'set fillStyle(#E0651F)',
      'beginPath()',
      'roundRect(-2, -6, 4, 12, 2)',
      'fill()',
    ]);
  });

  it('should move the strap when the player swings', () => {
    const calls = drawRecorded(createPlayerBodyStep(4, PLAYER_COLORS));

    expect(calls).toEqual([
      'beginPath()',
      'roundRect(-8, -9, 16, 19, 5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F4762C)',
      'fill()',
      'set fillStyle(#E0651F)',
      'beginPath()',
      'roundRect(-4, -6, 4, 12, 2)',
      'fill()',
    ]);
  });
});
