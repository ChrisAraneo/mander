import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawBeartrapTeeth } from './draw-beartrap-teeth';

describe('drawBeartrapTeeth', () => {
  it('should draw the three outlined teeth of a jaw when it is applied to a canvas', () => {
    const calls = drawRecorded(drawBeartrapTeeth);

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(1.75, -6.1)',
      'lineTo(5.25, -4.5)',
      'lineTo(1.75, -2.9)',
      'closePath()',
      'moveTo(1.75, -10.1)',
      'lineTo(5.25, -8.5)',
      'lineTo(1.75, -6.9)',
      'closePath()',
      'moveTo(1.75, -14.1)',
      'lineTo(5.25, -12.5)',
      'lineTo(1.75, -10.9)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#E8EEF4)',
      'fill()',
    ]);
  });
});
