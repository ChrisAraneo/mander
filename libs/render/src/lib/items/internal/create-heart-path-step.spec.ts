import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createHeartPathStep } from './create-heart-path-step';

describe('createHeartPathStep', () => {
  it('should trace two lobes and the tip when it is given a centre and a lobe size', () => {
    const calls = drawRecorded(createHeartPathStep(16, 15, 8));

    expect(calls).toEqual([
      'beginPath()',
      'arc(8, 12.6, 8, 3.1416, 0)',
      'arc(24, 12.6, 8, 3.1416, 0)',
      'lineTo(16, 26.2)',
      'closePath()',
    ]);
  });

  it('should trace a smaller heart when it is given a smaller lobe', () => {
    const calls = drawRecorded(createHeartPathStep(40, 30, 4));

    expect(calls).toEqual([
      'beginPath()',
      'arc(36, 28.8, 4, 3.1416, 0)',
      'arc(44, 28.8, 4, 3.1416, 0)',
      'lineTo(40, 35.6)',
      'closePath()',
    ]);
  });
});
