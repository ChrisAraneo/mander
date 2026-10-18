import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createScaleStep } from './create-scale-step';

describe('createScaleStep', () => {
  it('should stretch the canvas by the factors when it is given two factors', () => {
    const calls = drawRecorded(createScaleStep(-1, 2));

    expect(calls).toEqual(['scale(-1, 2)']);
  });
});
