import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawCannonballIron } from './draw-cannonball-iron';

describe('drawCannonballIron', () => {
  it('should draw the iron ball with its shine when it is applied to a canvas', () => {
    const calls = drawRecorded(drawCannonballIron);

    expect(calls).toEqual([
      'beginPath()',
      'arc(0, 0, 6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(-2, -2, 1, 0, 0, 6)',
      'addColorStop(0, #7C8496)',
      'addColorStop(1, #171C26)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(RGBA(255, 255, 255, 0.55))',
      'beginPath()',
      'arc(-2, -2, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });
});
