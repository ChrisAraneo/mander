import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { hashRecorded } from '../../../test/hash-recorded';
import { createItemFireballsStep } from './create-item-fireballs-step';

describe('createItemFireballsStep', () => {
  it('should draw two fireballs opposite each other when the count is two', () => {
    const fingerprint = hashRecorded(createItemFireballsStep(2, 64));

    expect(fingerprint).toBe('48:0WN4IKY1GBTW1S');
  });

  it('should draw one fireball at the top when the count is zero', () => {
    const calls = drawRecorded(createItemFireballsStep(0, 64));

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
});
