import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawBeartrapSprings } from './draw-beartrap-springs';

describe('drawBeartrapSprings', () => {
  it('should draw both springs from left to right when it is applied to a canvas', () => {
    const calls = drawRecorded(drawBeartrapSprings);

    expect(calls).toEqual([
      'beginPath()',
      'arc(-6, 6, 2.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#B4603A)',
      'fill()',
      'beginPath()',
      'arc(6, 6, 2.6, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#B4603A)',
      'fill()',
    ]);
  });
});
