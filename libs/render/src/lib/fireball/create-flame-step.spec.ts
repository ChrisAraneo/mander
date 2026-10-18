import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { EMBER_FIREBALL } from './consts';
import { createFlameStep } from './create-flame-step';

describe('createFlameStep', () => {
  it('should draw the flame with its usual tail when no tail length is given', () => {
    const calls = drawRecorded(
      createFlameStep({ x: 10, y: 20 }, 0.5, 6, EMBER_FIREBALL),
    );

    expect(calls).toEqual([
      'save()',
      'translate(10, 20)',
      'rotate(0.5)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
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
      'restore()',
    ]);
  });

  it('should draw a shorter tail when a tail length is given', () => {
    const calls = drawRecorded(
      createFlameStep({ x: 10, y: 20 }, 0.5, 6, EMBER_FIREBALL, 10),
    );

    expect(calls).toEqual([
      'save()',
      'translate(10, 20)',
      'rotate(0.5)',
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-5, 0, 10, 2.0455, 0, 0, 6.2832)',
      'fill()',
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
      'restore()',
    ]);
  });
});
