import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyWingStep } from './create-enemy-wing-step';

describe('createEnemyWingStep', () => {
  it('should draw the left wing tilted by the flap when it is given the left side', () => {
    const calls = drawRecorded(createEnemyWingStep(-1, 0.3));

    expect(calls).toEqual([
      'save()',
      'translate(-8, -3)',
      'rotate(-0.3)',
      'beginPath()',
      'ellipse(-7, 0, 8, 3.5, 0, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#FFFFFF)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the right wing tilted the other way when it is given the right side', () => {
    const calls = drawRecorded(createEnemyWingStep(1, -0.6));

    expect(calls).toEqual([
      'save()',
      'translate(8, -3)',
      'rotate(-0.6)',
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
