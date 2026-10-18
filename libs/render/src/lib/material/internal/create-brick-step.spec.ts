import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { BRICK_STYLE } from '../consts';
import { createBrickStep } from './create-brick-step';

describe('createBrickStep', () => {
  it('should draw three mortar lines and the staggered joints when the tile is at the origin', () => {
    const calls = drawRecorded(createBrickStep(0, 0, BRICK_STYLE));

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(0, 8, 32, 1)',
      'fillRect(0, 16, 32, 1)',
      'fillRect(0, 24, 32, 1)',
      'fillRect(16, 0, 1, 8)',
      'fillRect(8, 8, 1, 8)',
      'fillRect(16, 16, 1, 8)',
      'fillRect(8, 24, 1, 8)',
    ]);
  });

  it('should draw the same pattern moved when the tile is elsewhere', () => {
    const calls = drawRecorded(createBrickStep(64, 32, BRICK_STYLE));

    expect(calls).toEqual([
      'set fillStyle(RGBA(0, 0, 0, 0.26))',
      'fillRect(64, 40, 32, 1)',
      'fillRect(64, 48, 32, 1)',
      'fillRect(64, 56, 32, 1)',
      'fillRect(80, 32, 1, 8)',
      'fillRect(72, 40, 1, 8)',
      'fillRect(80, 48, 1, 8)',
      'fillRect(72, 56, 1, 8)',
    ]);
  });
});
