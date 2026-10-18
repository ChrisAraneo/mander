import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createLineToStep } from './create-line-to-step';

describe('createLineToStep', () => {
  it('should add a line to the point when it is given a point', () => {
    const calls = drawRecorded(createLineToStep(7, 8));

    expect(calls).toEqual(['lineTo(7, 8)']);
  });
});
