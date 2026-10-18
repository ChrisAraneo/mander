import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { WOOD_STYLE } from '../consts';
import { createWoodStep } from './create-wood-step';

const HSL_WOOD_STYLE = { ...WOOD_STYLE, base: 'HSL(26, 21%, 43%)' };

describe('createWoodStep', () => {
  it('should draw two planks with their own noise when the tile is at the origin', () => {
    const calls = drawRecorded(createWoodStep(0, 0, WOOD_STYLE));

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
      'set fillStyle(#96694F)',
      'fillRect(0, 16, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(0, 17, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(0, 29, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(3, 19, 26, 1)',
      'fillRect(12, 27, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(2, 21, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(0, 31, 32, 1)',
      'fillRect(6, 16, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(7, 16, 1, 15)',
    ]);
  });

  it('should draw two planks with other noise when the tile is elsewhere', () => {
    const calls = drawRecorded(createWoodStep(96, 64, HSL_WOOD_STYLE));

    expect(calls).toEqual([
      'set fillStyle(HSL(26, 21%, 43%))',
      'fillRect(96, 64, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(96, 65, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(96, 77, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(96, 69, 26, 1)',
      'fillRect(108, 75, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(100, 69, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(96, 79, 32, 1)',
      'fillRect(110, 64, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(111, 64, 1, 15)',
      'set fillStyle(HSL(26, 21%, 41%))',
      'fillRect(96, 80, 32, 16)',
      'set fillStyle(RGBA(255, 255, 255, 0.18))',
      'fillRect(96, 81, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.20))',
      'fillRect(96, 93, 32, 2)',
      'set fillStyle(RGBA(0, 0, 0, 0.18))',
      'fillRect(97, 84, 26, 1)',
      'fillRect(106, 91, 22, 1)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(99, 85, 18, 1)',
      'set fillStyle(RGBA(52, 38, 30, 0.85))',
      'fillRect(96, 95, 32, 1)',
      'fillRect(100, 80, 1, 15)',
      'set fillStyle(RGBA(255, 255, 255, 0.14))',
      'fillRect(101, 80, 1, 15)',
    ]);
  });
});
