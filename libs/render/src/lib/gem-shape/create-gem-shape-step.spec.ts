import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { CYAN_GEM_COLORS } from './consts';
import { createGemShapeStep } from './create-gem-shape-step';

describe('createGemShapeStep', () => {
  it('should draw the cut gem with its girdle line when it is given a centre and a size', () => {
    const calls = drawRecorded(
      createGemShapeStep(16, 20, 8, 10, CYAN_GEM_COLORS),
    );

    expect(calls).toEqual([
      'save()',
      'beginPath()',
      'moveTo(16, 10)',
      'lineTo(24, 17.5)',
      'lineTo(16, 30)',
      'lineTo(8, 17.5)',
      'closePath()',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'createLinearGradient(16, 10, 16, 30)',
      'addColorStop(0, #DFFBFF)',
      'addColorStop(0.45, #35C7E0)',
      'addColorStop(1, #12718F)',
      'set fillStyle(gradient)',
      'fill()',
      'restore()',
      'set strokeStyle(#12718F)',
      'set lineWidth(1)',
      'beginPath()',
      'moveTo(8, 17.5)',
      'lineTo(24, 17.5)',
      'stroke()',
    ]);
  });
});
