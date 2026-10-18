import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createFillRectStep } from './create-fill-rect-step';

describe('createFillRectStep', () => {
  it('should fill the rectangle when it is given its corner and size', () => {
    const calls = drawRecorded(createFillRectStep(1, 2, 3, 4));

    expect(calls).toEqual(['fillRect(1, 2, 3, 4)']);
  });
});
