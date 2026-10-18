import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawCannonBarrel } from './draw-cannon-barrel';

describe('drawCannonBarrel', () => {
  it('should draw the barrel with its muzzle when it is applied to a canvas', () => {
    const calls = drawRecorded(drawCannonBarrel);

    expect(calls).toEqual([
      'beginPath()',
      'roundRect(-5, -6.5, 28, 13, 3)',
      'roundRect(18, -9, 5, 18, 2)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(0, -6.5, 0, 6.5)',
      'addColorStop(0, #8892A8)',
      'addColorStop(0.45, #454E62)',
      'addColorStop(1, #1D2330)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
