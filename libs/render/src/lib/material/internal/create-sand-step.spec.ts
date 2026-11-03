import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { SAND_STYLE } from '../consts';
import { createSandStep } from './create-sand-step';

describe('createSandStep', () => {
  it('should draw the ripples and the light grains when it is given a tile position', () => {
    const calls = drawRecorded(createSandStep(32, 64, SAND_STYLE));

    expect(calls).toEqual([
      'set fillStyle(RGBA(138, 98, 42, 0.42))',
      'fillRect(50, 68, 8, 1)',
      'fillRect(58, 67, 4, 1)',
      'fillRect(35, 75, 7, 1)',
      'fillRect(42, 74, 6, 1)',
      'fillRect(48, 75, 5, 1)',
      'fillRect(45, 83, 8, 1)',
      'fillRect(53, 82, 6, 1)',
      'fillRect(59, 83, 3, 1)',
      'fillRect(34, 90, 6, 1)',
      'fillRect(40, 89, 7, 1)',
      'fillRect(47, 90, 4, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.16))',
      'fillRect(37, 79, 3, 2)',
      'fillRect(56, 76, 3, 2)',
      'fillRect(54, 88, 3, 2)',
      'fillRect(36, 85, 2, 1)',
    ]);
  });
});
