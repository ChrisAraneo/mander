import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawCannonRivets } from './draw-cannon-rivets';

describe('drawCannonRivets', () => {
  it('should draw a rivet in each corner when it is applied to a canvas', () => {
    const calls = drawRecorded(drawCannonRivets);

    expect(calls).toEqual([
      'set fillStyle(#1D2330)',
      'beginPath()',
      'arc(-11, -11, 1.5, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(11, -11, 1.5, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(-11, 11, 1.5, 0, 6.2832)',
      'fill()',
      'beginPath()',
      'arc(11, 11, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });
});
