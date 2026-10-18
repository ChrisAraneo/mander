import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawCannonMount } from './draw-cannon-mount';

describe('drawCannonMount', () => {
  it('should draw the iron mount filling the tile when it is applied to a canvas', () => {
    const calls = drawRecorded(drawCannonMount);

    expect(calls).toEqual([
      'beginPath()',
      'roundRect(-15, -15, 30, 30, 5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(0, -16, 0, 16)',
      'addColorStop(0, #454E62)',
      'addColorStop(1, #1D2330)',
      'set fillStyle(gradient)',
      'fill()',
      'set fillStyle(#6B7690)',
      'fillRect(-12, -13, 24, 3)',
    ]);
  });
});
