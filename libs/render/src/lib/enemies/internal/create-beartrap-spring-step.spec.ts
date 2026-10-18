import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createBeartrapSpringStep } from './create-beartrap-spring-step';

describe('createBeartrapSpringStep', () => {
  it('should draw the spring at the left hinge when it is given the left side', () => {
    const calls = drawRecorded(createBeartrapSpringStep(-1));

    expect(calls).toEqual([
      'beginPath()',
      'arc(-6, 6, 2.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#B4603A)',
      'fill()',
    ]);
  });

  it('should draw the spring at the right hinge when it is given the right side', () => {
    const calls = drawRecorded(createBeartrapSpringStep(1));

    expect(calls).toEqual([
      'beginPath()',
      'arc(6, 6, 2.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#B4603A)',
      'fill()',
    ]);
  });
});
