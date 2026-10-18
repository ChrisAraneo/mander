import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createKeyGlyphStep } from './create-key-glyph-step';

describe('createKeyGlyphStep', () => {
  it('should draw the outlined golden key when it is given the centre of the key', () => {
    const calls = drawRecorded(createKeyGlyphStep(16, 20));

    expect(calls).toEqual([
      'beginPath()',
      'arc(16, 15, 4.5, 0, 6.2832)',
      'moveTo(16, 19.5)',
      'lineTo(16, 29)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(7)',
      'set lineJoin(round)',
      'stroke()',
      'beginPath()',
      'rect(16, 23, 5, 2.5)',
      'rect(16, 27, 6, 2.5)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set strokeStyle(#FFD166)',
      'set lineWidth(3)',
      'beginPath()',
      'arc(16, 15, 4.5, 0, 6.2832)',
      'moveTo(16, 19.5)',
      'lineTo(16, 29)',
      'stroke()',
      'set fillStyle(#FFD166)',
      'beginPath()',
      'rect(16, 23, 5, 2.5)',
      'rect(16, 27, 6, 2.5)',
      'fill()',
    ]);
  });
});
