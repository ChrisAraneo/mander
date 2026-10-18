import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawBeartrapPlate } from './draw-beartrap-plate';

describe('drawBeartrapPlate', () => {
  it('should draw the steel base plate with its shine when it is applied to a canvas', () => {
    const calls = drawRecorded(drawBeartrapPlate);

    expect(calls).toEqual([
      'beginPath()',
      'roundRect(-10, 5, 20, 6, 2)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#5A6673)',
      'fill()',
      'set fillStyle(#8E9AA6)',
      'beginPath()',
      'roundRect(-8, 6.5, 16, 2, 1)',
      'fill()',
    ]);
  });
});
