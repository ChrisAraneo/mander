import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { ICE_STYLE } from '../consts';
import { createIceStep } from './create-ice-step';

describe('createIceStep', () => {
  it('should draw the cracks, the sheen and the glints when it is given a tile position', () => {
    const calls = drawRecorded(createIceStep(32, 64, ICE_STYLE));

    expect(calls).toEqual([
      'set fillStyle(RGBA(74, 132, 170, 0.42))',
      'fillRect(36, 74, 10, 1)',
      'fillRect(46, 74, 1, 7)',
      'fillRect(47, 81, 8, 1)',
      'fillRect(53, 67, 1, 7)',
      'fillRect(38, 85, 1, 6)',
      'set fillStyle(RGBA(255, 255, 255, 0.34))',
      'fillRect(36, 88, 3, 2)',
      'fillRect(39, 85, 3, 2)',
      'fillRect(42, 82, 3, 2)',
      'set fillStyle(RGBA(255, 255, 255, 0.72))',
      'fillRect(55, 70, 4, 1)',
      'fillRect(56, 69, 1, 3)',
      'fillRect(40, 77, 3, 1)',
    ]);
  });
});
