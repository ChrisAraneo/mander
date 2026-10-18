import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { GOLD_STAR } from './consts';
import { drawStar } from './draw-star';

describe('drawStar', () => {
  it('should draw the star on the canvas when it is given a centre, a radius and colours', () => {
    const calls = drawRecorded((context) =>
      drawStar(context, 16, 16, 10, GOLD_STAR),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(16, 6)',
      'lineTo(18.5863, 12.4403)',
      'lineTo(25.5106, 12.9098)',
      'lineTo(20.1846, 17.3597)',
      'lineTo(21.8779, 24.0902)',
      'lineTo(16, 20.4)',
      'lineTo(10.1221, 24.0902)',
      'lineTo(11.8154, 17.3597)',
      'lineTo(6.4894, 12.9098)',
      'lineTo(13.4137, 12.4403)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(16, 6, 16, 26)',
      'addColorStop(0, #FFF8DC)',
      'addColorStop(0.45, #FFC93C)',
      'addColorStop(1, #A66A00)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });
});
