import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { ICE_BULLET } from './consts';
import { createBulletBodyStep } from './create-bullet-body-step';

describe('createBulletBodyStep', () => {
  it('should draw the ice ball with its shine when it is given a centre and a radius', () => {
    const calls = drawRecorded(createBulletBodyStep(10, 20, 6, ICE_BULLET));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(10, 20, 6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(8, 18, 1, 10, 20, 6)',
      'addColorStop(0, #BFEDFF)',
      'addColorStop(1, #12303F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.75))',
      'beginPath()',
      'arc(8, 18, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });
});
