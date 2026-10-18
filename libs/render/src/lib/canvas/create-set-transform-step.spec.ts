import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createSetTransformStep } from './create-set-transform-step';

describe('createSetTransformStep', () => {
  it('should replace the transform with the matrix when it is given six values', () => {
    const calls = drawRecorded(createSetTransformStep(2, 0, 0, 2, 5, 6));

    expect(calls).toEqual(['setTransform(2, 0, 0, 2, 5, 6)']);
  });
});
