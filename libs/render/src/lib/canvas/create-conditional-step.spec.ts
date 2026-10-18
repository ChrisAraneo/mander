import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createConditionalStep } from './create-conditional-step';
import { drawBeginPath } from './draw-begin-path';
import { drawFill } from './draw-fill';

describe('createConditionalStep', () => {
  it('should draw the steps in order when it is told to run', () => {
    const calls = drawRecorded(
      createConditionalStep(true, drawBeginPath, drawFill),
    );

    expect(calls).toEqual(['beginPath()', 'fill()']);
  });

  it('should draw nothing when it is told not to run', () => {
    const calls = drawRecorded(
      createConditionalStep(false, drawBeginPath, drawFill),
    );

    expect(calls).toEqual([]);
  });
});
