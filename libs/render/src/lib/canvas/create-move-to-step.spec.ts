import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createMoveToStep } from './create-move-to-step';

describe('createMoveToStep', () => {
  it('should move the pen to the point when it is given a point', () => {
    const calls = drawRecorded(createMoveToStep(5, 6));

    expect(calls).toEqual(['moveTo(5, 6)']);
  });
});
