import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { WOOD_STYLE } from '../consts';
import { createPlankStep } from './create-plank-step';

const HSL_WOOD_STYLE = { ...WOOD_STYLE, base: 'HSL(26, 21%, 43%)' };

describe('createPlankStep', () => {
  it('should draw a plank with its grain and butt joint near the left when the seed is zero', () => {
    const calls = drawRecorded(createPlankStep(0, 0, 0, WOOD_STYLE));

    expect(calls).toEqual([
      'set fillStyle(#96694F)',
      'fillRect(0, 0, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(0, 1, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(0, 13, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(0, 3, 26, 1)',
      'fillRect(6, 11, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(2, 5, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(0, 15, 32, 1)',
      'fillRect(3, 0, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(4, 0, 1, 15)',
    ]);
  });

  it('should shift the grain, the joint and the tone when the seed is larger', () => {
    const calls = drawRecorded(createPlankStep(32, 16, 37, HSL_WOOD_STYLE));

    expect(calls).toEqual([
      'set fillStyle(HSL(26, 21%, 47%))',
      'fillRect(32, 16, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(32, 17, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(32, 29, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(34, 20, 26, 1)',
      'fillRect(40, 27, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(35, 21, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(32, 31, 32, 1)',
      'fillRect(48, 16, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(49, 16, 1, 15)',
    ]);
  });
});
