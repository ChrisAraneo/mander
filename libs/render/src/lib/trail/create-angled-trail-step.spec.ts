import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createAngledTrailStep } from './create-angled-trail-step';

describe('createAngledTrailStep', () => {
  it('should stretch the trail straight behind the origin when the angle is level', () => {
    const calls = drawRecorded(createAngledTrailStep('#FF0000', 10, 2, 0));

    expect(calls).toEqual([
      'set fillStyle(#FF0000)',
      'beginPath()',
      'ellipse(-5, 0, 10, 2, 0, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should tilt the trail and keep it behind the origin when the angle points down', () => {
    const calls = drawRecorded(
      createAngledTrailStep('#FF0000', 10, 2, Math.PI / 2),
    );

    expect(calls).toEqual([
      'set fillStyle(#FF0000)',
      'beginPath()',
      'ellipse(0, -5, 10, 2, 1.5708, 0, 6.2832)',
      'fill()',
    ]);
  });
});
