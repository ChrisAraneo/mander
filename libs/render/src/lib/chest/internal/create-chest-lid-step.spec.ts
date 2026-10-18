import type { Rectangle } from '@mander/utils';
import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createChestLidStep } from './create-chest-lid-step';

const CHEST: Rectangle = { x: 96, y: 8, width: 24, height: 22 };

describe('createChestLidStep', () => {
  it('should draw the raised lid over a dark cavity when the chest is open', () => {
    const calls = drawRecorded(createChestLidStep(CHEST, true));

    expect(calls).toEqual([
      'beginPath()',
      'rect(94, 2, 28, 7)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#8A683A)',
      'fill()',
      'set fillStyle(#2C2418)',
      'fillRect(98, 14, 20, 5)',
    ]);
  });

  it('should draw the shut lid with its latch when the chest is closed', () => {
    const calls = drawRecorded(createChestLidStep(CHEST, false));

    expect(calls).toEqual([
      'beginPath()',
      'rect(95, 8, 26, 9)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#C3913F)',
      'fill()',
      'set fillStyle(#E8C15C)',
      'fillRect(106, 14, 4, 7)',
    ]);
  });
});
