import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { hashRecorded } from '../../../test/hash-recorded';
import { createItemHeartsStep } from './create-item-hearts-step';

describe('createItemHeartsStep', () => {
  it('should draw one big heart when the count is one', () => {
    const calls = drawRecorded(createItemHeartsStep(1, 64));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(15.36, 24.448, 16.64, 3.1416, 0)',
      'arc(48.64, 24.448, 16.64, 3.1416, 0)',
      'lineTo(32, 52.736)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(15.36, 7.808, 48.64, 57.728)',
      'addColorStop(0, #FFC2CE)',
      'addColorStop(0.4, #FF5470)',
      'addColorStop(1, #8E1B33)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw three smaller hearts when the count is three', () => {
    const fingerprint = hashRecorded(createItemHeartsStep(3, 64));

    expect(fingerprint).toBe('51:0XS81AZ155LDTE');
  });
});
