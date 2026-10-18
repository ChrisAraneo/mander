import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createRotateStep } from './create-rotate-step';

describe('createRotateStep', () => {
  it('should turn the canvas by the angle when it is given an angle', () => {
    const calls = drawRecorded(createRotateStep(0.5));

    expect(calls).toEqual(['rotate(0.5)']);
  });
});
