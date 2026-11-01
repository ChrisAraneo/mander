import { filter, includes } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { EMBER_FIREBALL } from './consts';
import { createFlameStep } from './create-flame-step';

describe('createFlameStep', () => {
  it('should draw the flame where it is told to when it is given a place and a radius', () => {
    const calls = drawRecorded(
      createFlameStep({ x: 10, y: 20 }, 6, EMBER_FIREBALL),
    );

    expect(calls).toEqual([
      'save()',
      'translate(10, 20)',
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

  it('should drag no tail behind the flame when it draws one', () => {
    const calls = drawRecorded(
      createFlameStep({ x: 10, y: 20 }, 6, EMBER_FIREBALL),
    );

    expect(filter(calls, (call) => includes(call, 'ellipse('))).toEqual([]);
  });
});
