import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createEllipseStep } from './create-ellipse-step';

describe('createEllipseStep', () => {
  it('should add the ellipse to the path when it is given a centre, two radii and the angles', () => {
    const calls = drawRecorded(
      createEllipseStep(1, 2, 3, 4, 0.5, 0, Math.PI * 2),
    );

    expect(calls).toEqual(['ellipse(1, 2, 3, 4, 0.5, 0, 6.2832)']);
  });
});
