import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawBeartrapPan } from './draw-beartrap-pan';

describe('drawBeartrapPan', () => {
  it('should draw the pressure pan on the plate when it is applied to a canvas', () => {
    const calls = drawRecorded(drawBeartrapPan);

    expect(calls).toEqual([
      'beginPath()',
      'roundRect(-5, 2, 10, 3, 1)',
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
      'set fillStyle(#E8EEF4)',
      'fill()',
    ]);
  });
});
