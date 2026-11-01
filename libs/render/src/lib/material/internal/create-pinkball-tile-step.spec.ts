import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { PINKBALL_STYLE } from '../consts';
import { createPinkballTileStep } from './create-pinkball-tile-step';

describe('createPinkballTileStep', () => {
  it('should draw the shadowed veins and the blossom core when it is given a tile position', () => {
    const calls = drawRecorded(createPinkballTileStep(0, 32, PINKBALL_STYLE));

    expect(calls).toEqual([
      'save()',
      'set fillStyle(RGBA(0, 0, 0, 0.45))',
      'fillRect(4, 38, 8, 2)',
      'fillRect(18, 37, 10, 2)',
      'fillRect(3, 48, 6, 2)',
      'fillRect(20, 52, 9, 2)',
      'fillRect(10, 39, 2, 7)',
      'fillRect(21, 42, 2, 9)',
      'set fillStyle(#FF72C4)',
      'fillRect(4, 37, 8, 2)',
      'fillRect(18, 36, 10, 2)',
      'fillRect(3, 47, 6, 2)',
      'fillRect(20, 51, 9, 2)',
      'fillRect(10, 38, 2, 7)',
      'fillRect(21, 41, 2, 9)',
      'set fillStyle(#FFF0F8)',
      'beginPath()',
      'arc(16, 48, 4, 0, 6.2832)',
      'fill()',
      'restore()',
    ]);
  });
});
