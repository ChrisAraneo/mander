import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createStarPathStep } from './create-star-path-step';

describe('createStarPathStep', () => {
  it('should trace the ten corners of the star when it is given a centre and a radius', () => {
    const calls = drawRecorded(createStarPathStep(16, 16, 10));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(16, 6)',
      'lineTo(18.5863, 12.4403)',
      'lineTo(25.5106, 12.9098)',
      'lineTo(20.1846, 17.3597)',
      'lineTo(21.8779, 24.0902)',
      'lineTo(16, 20.4)',
      'lineTo(10.1221, 24.0902)',
      'lineTo(11.8154, 17.3597)',
      'lineTo(6.4894, 12.9098)',
      'lineTo(13.4137, 12.4403)',
      'closePath()',
    ]);
  });
});
