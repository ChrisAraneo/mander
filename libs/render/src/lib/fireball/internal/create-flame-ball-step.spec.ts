import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { EMBER_FIREBALL } from '../consts';
import { createFlameBallStep } from './create-flame-ball-step';

describe('createFlameBallStep', () => {
  it('should draw the glowing ball with its bright core when it is given a radius and colours', () => {
    const calls = drawRecorded(createFlameBallStep(6, EMBER_FIREBALL));

    expect(calls).toEqual([
      'beginPath()',
      'arc(0, 0, 6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 6)',
      'addColorStop(0, #FFF3C4)',
      'addColorStop(0.45, #FFB03A)',
      'addColorStop(1, #D8341C)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFF3C4)',
      'beginPath()',
      'arc(0, 0, 2.3077, 0, 6.2832)',
      'fill()',
    ]);
  });
});
