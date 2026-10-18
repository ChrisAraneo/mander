import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createTranslateStep } from './create-translate-step';

describe('createTranslateStep', () => {
  it('should shift the canvas by the offset when it is given an offset', () => {
    const calls = drawRecorded(createTranslateStep(9, -9));

    expect(calls).toEqual(['translate(9, -9)']);
  });
});
