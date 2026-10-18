import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createBeartrapToothStep } from './create-beartrap-tooth-step';

describe('createBeartrapToothStep', () => {
  it('should trace a tooth near the hinge when it is given the lowest tooth position', () => {
    const calls = drawRecorded(createBeartrapToothStep(-4.5));

    expect(calls).toEqual([
      'moveTo(1.75, -6.1)',
      'lineTo(5.25, -4.5)',
      'lineTo(1.75, -2.9)',
      'closePath()',
    ]);
  });

  it('should trace a tooth near the tip when it is given the highest tooth position', () => {
    const calls = drawRecorded(createBeartrapToothStep(-12.5));

    expect(calls).toEqual([
      'moveTo(1.75, -14.1)',
      'lineTo(5.25, -12.5)',
      'lineTo(1.75, -10.9)',
      'closePath()',
    ]);
  });
});
