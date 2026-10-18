import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { STONE_STYLE } from '../consts';
import { createStoneStep } from './create-stone-step';

describe('createStoneStep', () => {
  it('should draw two dark flecks and two light ones when it is given a tile position', () => {
    const calls = drawRecorded(createStoneStep(32, 64, STONE_STYLE));

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(38, 71, 7, 5)',
      'fillRect(51, 80, 8, 6)',
      'set fillStyle(RGBA(255, 255, 255, 0.16))',
      'fillRect(40, 84, 6, 4)',
      'fillRect(52, 70, 5, 4)',
    ]);
  });
});
