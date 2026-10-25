import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createHeartShoulderPathStep } from './create-heart-shoulder-path-step';

describe('createHeartShoulderPathStep', () => {
  it('should trace two lobes on the shoulder line and the tip below them when it is given a lobe size', () => {
    const calls = drawRecorded(createHeartShoulderPathStep(16, 12, 8));

    expect(calls).toEqual([
      'beginPath()',
      'arc(8, 12, 8, 3.1416, 0)',
      'arc(24, 12, 8, 3.1416, 0)',
      'lineTo(16, 25.6)',
      'closePath()',
    ]);
  });

  it('should trace a heart squashed to a point when it is given no lobe size', () => {
    const calls = drawRecorded(createHeartShoulderPathStep(5, 6, 0));

    expect(calls).toEqual([
      'beginPath()',
      'arc(5, 6, 0, 3.1416, 0)',
      'arc(5, 6, 0, 3.1416, 0)',
      'lineTo(5, 6)',
      'closePath()',
    ]);
  });
});
