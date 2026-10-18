import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawCannonTrunnion } from './draw-cannon-trunnion';

describe('drawCannonTrunnion', () => {
  it('should draw the round trunnion with its dark hub when it is applied to a canvas', () => {
    const calls = drawRecorded(drawCannonTrunnion);

    expect(calls).toEqual([
      'beginPath()',
      'arc(-4, 0, 5, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#6B7690)',
      'fill()',
      'set fillStyle(#1D2330)',
      'beginPath()',
      'arc(-4, 0, 2, 0, 6.2832)',
      'fill()',
    ]);
  });
});
