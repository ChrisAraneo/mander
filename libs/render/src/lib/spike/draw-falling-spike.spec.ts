import type { FallingSpike } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { drawFallingSpike } from './draw-falling-spike';

const SPIKE: FallingSpike = {
  position: { x: 32, y: 0 },
  velocity: { y: { current: 0, max: 400 } },
  statuses: { isFalling: false },
};

describe('drawFallingSpike', () => {
  it('should draw the falling spike on the canvas when it is given one spike', () => {
    const calls = drawRecorded((context) => drawFallingSpike(context, SPIKE));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(45.1667, 0)',
      'lineTo(48, 21.76)',
      'lineTo(50.8333, 0)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(45.1667, 0, 45.1667, 21.76)',
      'addColorStop(0, #797D8E)',
      'addColorStop(1, #C2C5CF)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
