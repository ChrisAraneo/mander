import type { FallingSpike } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createFallingSpikeStep } from './create-falling-spike-step';

const HANGING_SPIKE: FallingSpike = {
  position: { x: 64, y: 32 },
  velocity: { y: { current: 0, max: 400 } },
  statuses: { isFalling: false },
};

const FALLING_SPIKE: FallingSpike = {
  position: { x: 96, y: 80 },
  velocity: { y: { current: 200, max: 400 } },
  statuses: { isFalling: true },
};

describe('createFallingSpikeStep', () => {
  it('should draw the spike in its grey colours when it still hangs', () => {
    const calls = drawRecorded(createFallingSpikeStep(HANGING_SPIKE));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(77.1667, 32)',
      'lineTo(80, 53.76)',
      'lineTo(82.8333, 32)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(77.1667, 32, 77.1667, 53.76)',
      'addColorStop(0, #797D8E)',
      'addColorStop(1, #C2C5CF)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });

  it('should draw the spike where it has fallen to when it is falling', () => {
    const calls = drawRecorded(createFallingSpikeStep(FALLING_SPIKE));

    expect(calls).toEqual([
      'beginPath()',
      'moveTo(109.1667, 80)',
      'lineTo(112, 101.76)',
      'lineTo(114.8333, 80)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(109.1667, 80, 109.1667, 101.76)',
      'addColorStop(0, #797D8E)',
      'addColorStop(1, #C2C5CF)',
      'set fillStyle(gradient)',
      'fill()',
    ]);
  });
});
