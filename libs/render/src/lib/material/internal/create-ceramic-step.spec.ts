import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { CERAMIC_STYLE } from '../consts';
import { createCeramicStep } from './create-ceramic-step';

describe('createCeramicStep', () => {
  it('should draw the cross of joints and two glints when it is given a tile position', () => {
    const calls = drawRecorded(createCeramicStep(32, 0, CERAMIC_STYLE));

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(48, 0, 1, 32)',
      'fillRect(32, 16, 32, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.16))',
      'fillRect(35, 3, 9, 1)',
      'fillRect(51, 19, 9, 1)',
    ]);
  });
});
