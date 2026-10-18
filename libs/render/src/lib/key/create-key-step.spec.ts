import type { Rectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createKeyStep } from './create-key-step';

const KEY: Rectangle = { x: 100, y: 10, width: 14, height: 20 };

describe('createKeyStep', () => {
  it('should draw the key at the middle of its box when the bob is at its middle', () => {
    const calls = drawRecorded(createKeyStep(KEY, 0));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(107, 15, 4.5, 0, 6.2832)',
      'moveTo(107, 19.5)',
      'lineTo(107, 29)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(7)',
      'set lineJoin(round)',
      'stroke()',
      'beginPath()',
      'rect(107, 23, 5, 2.5)',
      'rect(107, 27, 6, 2.5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set strokeStyle(#FFD166)',
      'set lineWidth(3)',
      'beginPath()',
      'arc(107, 15, 4.5, 0, 6.2832)',
      'moveTo(107, 19.5)',
      'lineTo(107, 29)',
      'stroke()',
      'set fillStyle(#FFD166)',
      'beginPath()',
      'rect(107, 23, 5, 2.5)',
      'rect(107, 27, 6, 2.5)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw the key lifted when the bob has moved on', () => {
    const calls = drawRecorded(createKeyStep(KEY, 0.5));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(107, 17.9925, 4.5, 0, 6.2832)',
      'moveTo(107, 22.4925)',
      'lineTo(107, 31.9925)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(7)',
      'set lineJoin(round)',
      'stroke()',
      'beginPath()',
      'rect(107, 25.9925, 5, 2.5)',
      'rect(107, 29.9925, 6, 2.5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set strokeStyle(#FFD166)',
      'set lineWidth(3)',
      'beginPath()',
      'arc(107, 17.9925, 4.5, 0, 6.2832)',
      'moveTo(107, 22.4925)',
      'lineTo(107, 31.9925)',
      'stroke()',
      'set fillStyle(#FFD166)',
      'beginPath()',
      'rect(107, 25.9925, 5, 2.5)',
      'rect(107, 29.9925, 6, 2.5)',
      'fill()',
      'restore()',
    ]);
  });
});
