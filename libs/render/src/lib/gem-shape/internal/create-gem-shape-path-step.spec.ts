import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createGemShapePathStep } from './create-gem-shape-path-step';

describe('createGemShapePathStep', () => {
  it('should trace the four-sided cut of the gem when it is given a centre and a size', () => {
    const calls = drawRecorded(createGemShapePathStep(16, 20, 8, 10));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(16, 10)',
      'lineTo(24, 17.5)',
      'lineTo(16, 30)',
      'lineTo(8, 17.5)',
      'closePath()',
    ]);
  });
});
