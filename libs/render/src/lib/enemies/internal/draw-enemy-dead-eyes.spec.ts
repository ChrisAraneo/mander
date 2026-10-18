import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawEnemyDeadEyes } from './draw-enemy-dead-eyes';

describe('drawEnemyDeadEyes', () => {
  it('should cross out both eyes when it is applied to a canvas', () => {
    const calls = drawRecorded(drawEnemyDeadEyes);

    expect(calls).toEqual([
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
