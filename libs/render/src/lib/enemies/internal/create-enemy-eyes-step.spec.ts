import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createEnemyEyesStep } from './create-enemy-eyes-step';

describe('createEnemyEyesStep', () => {
  it('should draw open eyes with pupils when the enemy is alive', () => {
    const calls = drawRecorded(createEnemyEyesStep(false));

    expect(calls).toEqual([
      'set fillStyle(#FDF3EA)',
      'beginPath()',
      'arc(-4, -4, 3.2, 0, 6.2832)',
      'arc(3, -4, 3.2, 0, 6.2832)',
      'fill()',
      'set strokeStyle(#1C1C28)',
      'set fillStyle(#1C1C28)',
      'beginPath()',
      'arc(-3, -4, 1.4, 0, 6.2832)',
      'arc(4, -4, 1.4, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should draw crossed-out eyes when the enemy is dying', () => {
    const calls = drawRecorded(createEnemyEyesStep(true));

    expect(calls).toEqual([
      'set fillStyle(#FDF3EA)',
      'beginPath()',
      'arc(-4, -4, 3.2, 0, 6.2832)',
      'arc(3, -4, 3.2, 0, 6.2832)',
      'fill()',
      'set strokeStyle(#1C1C28)',
      'set fillStyle(#1C1C28)',
      'set lineWidth(1.2)',
      'beginPath()',
      'moveTo(-6, -6)',
      'lineTo(-1.5, -2)',
      'moveTo(-1.5, -6)',
      'lineTo(-6, -2)',
      'moveTo(1, -6)',
      'lineTo(5.5, -2)',
      'moveTo(5.5, -6)',
      'lineTo(1, -2)',
      'stroke()',
    ]);
  });
});
