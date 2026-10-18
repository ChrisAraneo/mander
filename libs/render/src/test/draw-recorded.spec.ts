import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createArcStep } from '../lib/canvas/create-arc-step';
import { draw } from '../lib/canvas/draw';
import { drawBeginPath } from '../lib/canvas/draw-begin-path';
import { drawFill } from '../lib/canvas/draw-fill';
import { drawRecorded } from './draw-recorded';

describe('drawRecorded', () => {
  it('should list the calls in order when it records a drawing', () => {
    const calls = drawRecorded((context) =>
      draw(
        context,
        drawBeginPath,
        createArcStep(0, 0, 3, 0, Math.PI * 2),
        drawFill,
      ),
    );

    expect(calls).toEqual(['beginPath()', 'arc(0, 0, 3, 0, 6.2832)', 'fill()']);
  });

  it('should list nothing when nothing is drawn', () => {
    const calls = drawRecorded(noop);

    expect(calls).toEqual([]);
  });
});
