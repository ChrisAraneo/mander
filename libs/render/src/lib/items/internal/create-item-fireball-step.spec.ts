import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createItemFireballStep } from './create-item-fireball-step';

describe('createItemFireballStep', () => {
  it('should draw the first fireball at the top of the orbit when it is given index zero', () => {
    const calls = drawRecorded(createItemFireballStep(0, 2, 64));

    expect(calls).toEqual([
      'save()',
      'translate(32, 14.72)',
      'rotate(0)',
      'set fillStyle(RGBA(230, 238, 255, 0.5))',
      'beginPath()',
      'ellipse(-10.88, 0, 21.76, 4.4509, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 9.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 9.6)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(0.45, #F2F6FF)',
      'addColorStop(1, #B9C6E8)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFFFFF)',
      'beginPath()',
      'arc(0, 0, 3.6923, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the next fireball a share of the circle further on when it is given index one', () => {
    const calls = drawRecorded(createItemFireballStep(1, 3, 64));

    expect(calls).toEqual([
      'save()',
      'translate(46.9649, 40.64)',
      'rotate(2.0944)',
      'set fillStyle(RGBA(230, 238, 255, 0.5))',
      'beginPath()',
      'ellipse(-10.88, 0, 21.76, 4.4509, 0, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(0, 0, 9.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(0, 0, 1, 0, 0, 9.6)',
      'addColorStop(0, #FFFFFF)',
      'addColorStop(0.45, #F2F6FF)',
      'addColorStop(1, #B9C6E8)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#FFFFFF)',
      'beginPath()',
      'arc(0, 0, 3.6923, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });
});
