import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createBeartrapJawStep } from './create-beartrap-jaw-step';

describe('createBeartrapJawStep', () => {
  it('should draw the jaw tilted open when it is given the open tilt', () => {
    const calls = drawRecorded(createBeartrapJawStep(-0.65));

    expect(calls).toEqual([
      'save()',
      'translate(-6, 6)',
      'rotate(-0.65)',
      'beginPath()',
      'roundRect(-1.75, -15, 3.5, 15, 1.6)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#8E9AA6)',
      'fill()',
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
      'restore()',
    ]);
  });

  it('should draw the jaw nearly upright when it is given the shut tilt', () => {
    const calls = drawRecorded(createBeartrapJawStep(0.12));

    expect(calls).toEqual([
      'save()',
      'translate(-6, 6)',
      'rotate(0.12)',
      'beginPath()',
      'roundRect(-1.75, -15, 3.5, 15, 1.6)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#8E9AA6)',
      'fill()',
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
      'restore()',
    ]);
  });
});
