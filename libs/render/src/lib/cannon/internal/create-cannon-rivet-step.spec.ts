import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createCannonRivetStep } from './create-cannon-rivet-step';

describe('createCannonRivetStep', () => {
  it('should draw the rivet near the top left corner when it is given that corner', () => {
    const calls = drawRecorded(createCannonRivetStep(-1, -1));

    expect(calls).toEqual([
      'beginPath()',
      'arc(-11, -11, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });

  it('should draw the rivet near the bottom right corner when it is given that corner', () => {
    const calls = drawRecorded(createCannonRivetStep(1, 1));

    expect(calls).toEqual([
      'beginPath()',
      'arc(11, 11, 1.5, 0, 6.2832)',
      'fill()',
    ]);
  });
});
