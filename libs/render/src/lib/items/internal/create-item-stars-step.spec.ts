import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { hashRecorded } from '../../../test/hash-recorded';
import { GOLD_STAR } from '../../star/consts';
import { createItemStarsStep } from './create-item-stars-step';

describe('createItemStarsStep', () => {
  it('should draw one big star when the count is one', () => {
    const calls = drawRecorded(createItemStarsStep(1, 64, GOLD_STAR));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(32, 6.4)',
      'lineTo(38.9519, 23.7116)',
      'lineTo(57.5644, 24.9736)',
      'lineTo(43.2483, 36.9348)',
      'lineTo(47.7997, 55.0264)',
      'lineTo(32, 45.1072)',
      'lineTo(16.2003, 55.0264)',
      'lineTo(20.7517, 36.9348)',
      'lineTo(6.4356, 24.9736)',
      'lineTo(25.0481, 23.7116)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(32, 6.4, 32, 60.16)',
      'addColorStop(0, #FFF8DC)',
      'addColorStop(0.45, #FFC93C)',
      'addColorStop(1, #A66A00)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
    ]);
  });

  it('should draw two stars when the count is two', () => {
    const fingerprint = hashRecorded(createItemStarsStep(2, 64, GOLD_STAR));

    expect(fingerprint).toBe('48:0OTP26C1RUQHT8');
  });
});
