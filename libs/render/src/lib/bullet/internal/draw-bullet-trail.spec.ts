import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawBulletTrail } from './draw-bullet-trail';

describe('drawBulletTrail', () => {
  it('should draw the pale trail behind the bullet when it is applied to a canvas', () => {
    const calls = drawRecorded(drawBulletTrail);

    expect(calls).toEqual([
      'set fillStyle(RGBA(123, 232, 255, 0.45))',
      'beginPath()',
      'ellipse(-9, 0, 18, 2.8, 0, 0, 6.2832)',
      'fill()',
    ]);
  });
});
