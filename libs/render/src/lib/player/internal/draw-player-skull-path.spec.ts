import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawPlayerSkullPath } from './draw-player-skull-path';

describe('drawPlayerSkullPath', () => {
  it('should trace the round head when it is applied to a canvas', () => {
    const calls = drawRecorded(drawPlayerSkullPath);

    expect(calls).toEqual(['beginPath()', 'arc(1, -16, 7, 0, 6.2832)']);
  });
});
