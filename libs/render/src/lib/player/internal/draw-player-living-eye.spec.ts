import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawPlayerLivingEye } from './draw-player-living-eye';

describe('drawPlayerLivingEye', () => {
  it('should draw a round eye when it is applied to a canvas', () => {
    const calls = drawRecorded(drawPlayerLivingEye);

    expect(calls).toEqual([
      'beginPath()',
      'arc(4.2, -15.6, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });
});
