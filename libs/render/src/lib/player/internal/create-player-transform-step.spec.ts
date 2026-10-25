import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createPlayerTransformStep } from './create-player-transform-step';

describe('createPlayerTransformStep', () => {
  it('should move to the middle of the player without a spin when it faces right and is alive', () => {
    const calls = drawRecorded(
      createPlayerTransformStep({ x: 64, y: 96 }, 1, 0),
    );

    expect(calls).toEqual(['translate(75, 120)', 'rotate(0)', 'scale(1, 1)']);
  });

  it('should mirror the player and spin it back when it faces left halfway through dying', () => {
    const calls = drawRecorded(
      createPlayerTransformStep({ x: 0, y: 0 }, -1, 0.5),
    );

    expect(calls).toEqual([
      'translate(11, 24)',
      'rotate(1.4137)',
      'scale(-1, 1)',
    ]);
  });

  it('should spin the player the other way when it faces right at the end of dying', () => {
    const calls = drawRecorded(createPlayerTransformStep({ x: 0, y: 0 }, 1, 1));

    expect(calls).toEqual([
      'translate(11, 24)',
      'rotate(-2.8274)',
      'scale(1, 1)',
    ]);
  });
});
