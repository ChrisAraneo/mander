import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { hashRecorded } from '../../../test/hash-recorded';
import { createItemBulletsStep } from './create-item-bullets-step';

describe('createItemBulletsStep', () => {
  it('should draw two bullets when the count is two', () => {
    const calls = drawRecorded(createItemBulletsStep(2, 64));

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'arc(22.4, 23.68, 12.16, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(18.3467, 19.6267, 1, 22.4, 23.68, 12.16)',
      'addColorStop(0, #BFEDFF)',
      'addColorStop(1, #12303F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.75))',
      'beginPath()',
      'arc(18.3467, 19.6267, 3.04, 0, 6.2832)',
      'fill()',
      'save()',
      'beginPath()',
      'arc(41.6, 40.32, 12.16, 0, 6.2832)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createRadialGradient(37.5467, 36.2667, 1, 41.6, 40.32, 12.16)',
      'addColorStop(0, #BFEDFF)',
      'addColorStop(1, #12303F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set fillStyle(RGBA(255, 255, 255, 0.75))',
      'beginPath()',
      'arc(37.5467, 36.2667, 3.04, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should draw the rain of nine bullets when the count is very large', () => {
    const fingerprint = hashRecorded(createItemBulletsStep(9999, 64));

    expect(fingerprint).toBe('153:07POWN813MH234');
  });
});
