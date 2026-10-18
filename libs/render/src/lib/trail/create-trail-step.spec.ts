import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createTrailStep } from './create-trail-step';

describe('createTrailStep', () => {
  it('should draw a flat ellipse trailing behind the origin when given a colour and a size', () => {
    const calls = drawRecorded(
      createTrailStep('RGBA(123, 232, 255, 0.45)', 18, 2.8),
    );

    expect(calls).toEqual([
      'set fillStyle(RGBA(123, 232, 255, 0.45))',
      'beginPath()',
      'ellipse(-9, 0, 18, 2.8, 0, 0, 6.2832)',
      'fill()',
    ]);
  });
});
