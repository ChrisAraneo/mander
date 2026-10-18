import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyWingsStep } from './create-enemy-wings-step';

describe('createEnemyWingsStep', () => {
  it('should draw both wings level when the clock is at zero', () => {
    const calls = drawRecorded(createEnemyWingsStep(0));

    expect(calls).toEqual([
      'save()',
      'translate(-8, -3)',
      'rotate(0)',
      'beginPath()',
      'ellipse(-7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
      'save()',
      'translate(8, -3)',
      'rotate(0)',
      'beginPath()',
      'ellipse(7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw both wings flapped when the clock has moved on', () => {
    const calls = drawRecorded(createEnemyWingsStep(0.4));

    expect(calls).toEqual([
      'save()',
      'translate(-8, -3)',
      'rotate(0.4541)',
      'beginPath()',
      'ellipse(-7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
      'save()',
      'translate(8, -3)',
      'rotate(-0.4541)',
      'beginPath()',
      'ellipse(7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
    ]);
  });
});
