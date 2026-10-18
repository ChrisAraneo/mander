import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createHeartStep } from './create-heart-step';

describe('createHeartStep', () => {
  it('should draw the red heart with its two lobes when it is given a centre and a lobe size', () => {
    const calls = drawRecorded(createHeartStep(16, 15, 8));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(8, 12.6, 8, 3.1416, 0)',
      'arc(24, 12.6, 8, 3.1416, 0)',
      'lineTo(16, 26.2)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(8, 4.6, 24, 28.6)',
      'addColorStop(0, #FFC2CE)',
      'addColorStop(0.4, #FF5470)',
      'addColorStop(1, #8E1B33)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw a smaller heart elsewhere when it is given another centre and lobe size', () => {
    const calls = drawRecorded(createHeartStep(40, 30, 4));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(36, 28.8, 4, 3.1416, 0)',
      'arc(44, 28.8, 4, 3.1416, 0)',
      'lineTo(40, 35.6)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(36, 24.8, 44, 36.8)',
      'addColorStop(0, #FFC2CE)',
      'addColorStop(0.4, #FF5470)',
      'addColorStop(1, #8E1B33)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });
});
