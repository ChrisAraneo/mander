import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../test/create-render-test-level';
import { drawRecorded } from '../../test/draw-recorded';
import { drawSpike } from './draw-spike';

describe('drawSpike', () => {
  it('should draw the spike on the canvas when the level has a spike there', () => {
    const level = createRenderTestLevel(['....', '..^.', '####']);

    const calls = drawRecorded((context) => drawSpike(context, level, 2, 1));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(77.1667, 64)',
      'lineTo(80, 42.24)',
      'lineTo(82.8333, 64)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(77.1667, 64, 77.1667, 42.24)',
      'addColorStop(0, #8B90A3)',
      'addColorStop(1, #DFE3EE)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
