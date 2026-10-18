import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createRoundRectStep } from './create-round-rect-step';

describe('createRoundRectStep', () => {
  it('should add the rounded rectangle to the path when it is given its corner, size and radius', () => {
    const calls = drawRecorded(createRoundRectStep(1, 2, 3, 4, 5));

    expect(calls).toEqual(['roundRect(1, 2, 3, 4, 5)']);
  });
});
