import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawEnemyLivingEyes } from './draw-enemy-living-eyes';

describe('drawEnemyLivingEyes', () => {
  it('should draw two round pupils when it is applied to a canvas', () => {
    const calls = drawRecorded(drawEnemyLivingEyes);

    expect(calls).toEqual([
      'beginPath()',
      'arc(-3, -4, 1.4, 0, 6.2832)',
      'arc(4, -4, 1.4, 0, 6.2832)',
      'fill()',
    ]);
  });
});
