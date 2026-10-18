import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createArcStep } from './create-arc-step';

describe('createArcStep', () => {
  it('should add the arc to the path when it is given a centre, a radius and two angles', () => {
    const calls = drawRecorded(createArcStep(1, 2, 3, 0, Math.PI));

    expect(calls).toEqual(['arc(1, 2, 3, 0, 3.1416)']);
  });
});
