import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { EMBER_FIREBALL } from '../consts';
import { createFlameTailStep } from './create-flame-tail-step';

describe('createFlameTailStep', () => {
  it('should draw the tail at its usual size when it is given the usual length', () => {
    const calls = drawRecorded(createFlameTailStep(EMBER_FIREBALL, 22));

    expect(calls).toEqual([
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-11, 0, 22, 4.5, 0, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should draw a thinner tail when it is given a shorter length', () => {
    const calls = drawRecorded(createFlameTailStep(EMBER_FIREBALL, 11));

    expect(calls).toEqual([
      'set fillStyle(RGBA(255, 138, 42, 0.5))',
      'beginPath()',
      'ellipse(-5.5, 0, 11, 2.25, 0, 0, 6.2832)',
      'fill()',
    ]);
  });
});
