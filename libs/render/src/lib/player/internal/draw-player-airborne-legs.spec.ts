import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { drawPlayerAirborneLegs } from './draw-player-airborne-legs';

describe('drawPlayerAirborneLegs', () => {
  it('should trace one leg drawn up when it is applied to a canvas', () => {
    const calls = drawRecorded(drawPlayerAirborneLegs);

    expect(calls).toEqual(['rect(-7, 6, 5, 15)', 'rect(2, 9, 5, 15)']);
  });
});
