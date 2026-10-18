import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PLAYER_COLORS } from '../consts';
import { createPlayerHeadStep } from './create-player-head-step';

describe('createPlayerHeadStep', () => {
  it('should draw the head, the hair and an open eye when the player is alive', () => {
    const calls = drawRecorded(createPlayerHeadStep(false, PLAYER_COLORS));

    expect(calls).toEqual([
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F2C49B)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'clip()',
      'set fillStyle(#4A3021)',
      'beginPath()',
      'arc(0.5, -17.5, 6.8, 2.9845, 6.346)',
      'fill()',
      'restore()',
      'set fillStyle(#1C1C28)',
      'beginPath()',
      'arc(4.2, -15.6, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should draw the head with a crossed-out eye when the player is dying', () => {
    const calls = drawRecorded(createPlayerHeadStep(true, PLAYER_COLORS));

    expect(calls).toEqual([
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#F2C49B)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(1, -16, 7, 0, 6.2832)',
      'clip()',
      'set fillStyle(#4A3021)',
      'beginPath()',
      'arc(0.5, -17.5, 6.8, 2.9845, 6.346)',
      'fill()',
      'restore()',
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
