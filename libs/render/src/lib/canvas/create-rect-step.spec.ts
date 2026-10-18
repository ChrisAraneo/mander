import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createRectStep } from './create-rect-step';

describe('createRectStep', () => {
  it('should add the rectangle to the path when it is given its corner and size', () => {
    const calls = drawRecorded(createRectStep(1, 2, 3, 4));

    expect(calls).toEqual(['rect(1, 2, 3, 4)']);
  });
});
