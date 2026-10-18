import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { RED_GEM_COLORS } from './consts';
import { drawGemShape } from './draw-gem-shape';

describe('drawGemShape', () => {
  it('should draw the gem on the canvas when it is given a centre, a size and colours', () => {
    const calls = drawRecorded((context) =>
      drawGemShape(context, 30, 40, 6, 9, RED_GEM_COLORS),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(30, 31)',
      'lineTo(36, 37.75)',
      'lineTo(30, 49)',
      'lineTo(24, 37.75)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(30, 31, 30, 49)',
      'addColorStop(0, #FFE1E7)',
      'addColorStop(0.45, #F0455F)',
      'addColorStop(1, #8E1B33)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#8E1B33)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(24, 37.75)',
      'lineTo(36, 37.75)',
      'stroke()',
    ]);
  });
});
