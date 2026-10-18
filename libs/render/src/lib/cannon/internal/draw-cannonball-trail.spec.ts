import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawCannonballTrail } from './draw-cannonball-trail';

describe('drawCannonballTrail', () => {
  it('should draw the glowing trail behind the ball when it is applied to a canvas', () => {
    const calls = drawRecorded(drawCannonballTrail);

    expect(calls).toEqual([
      'set fillStyle(RGBA(255, 158, 61, 0.45))',
      'beginPath()',
      'ellipse(-7.5, 0, 15, 3.2, 0, 0, 6.2832)',
      'fill()',
    ]);
  });
});
