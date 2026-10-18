import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createSequenceStep } from './create-sequence-step';
import { drawBeginPath } from './draw-begin-path';
import { drawFill } from './draw-fill';
import { drawStroke } from './draw-stroke';

describe('createSequenceStep', () => {
  it('should draw the steps in the order they are listed when it is given several', () => {
    const calls = drawRecorded(
      createSequenceStep([drawBeginPath, drawFill, drawStroke]),
    );

    expect(calls).toEqual(['beginPath()', 'fill()', 'stroke()']);
  });

  it('should draw nothing when the list is empty', () => {
    const calls = drawRecorded(createSequenceStep([]));

    expect(calls).toEqual([]);
  });
});
