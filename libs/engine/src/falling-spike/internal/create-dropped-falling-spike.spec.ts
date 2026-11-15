import { type FallingSpike, TERMINAL_VELOCITY } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createDroppedFallingSpike } from './create-dropped-falling-spike';

const SPIKE_LEFT = 64;

const CEILING_TOP = 0;

const BEFORE_FLOOR_TOP = 150;

const NO_FALL_SPEED = 0;

const SLOW_FALL_SPEED = 100;

const createSpike = (top: number, speed: number): FallingSpike => ({
  position: { x: SPIKE_LEFT, y: top },
  velocity: { y: { current: speed, max: TERMINAL_VELOCITY } },
  statuses: { isFalling: false },
});

describe('createDroppedFallingSpike', () => {
  it('should put the spike at the new height and give it the new speed when it has dropped', () => {
    const dropped = createDroppedFallingSpike(
      createSpike(CEILING_TOP, NO_FALL_SPEED),
      SLOW_FALL_SPEED,
      BEFORE_FLOOR_TOP,
    );

    expect(dropped.position).toEqual({
      x: SPIKE_LEFT,
      y: BEFORE_FLOOR_TOP,
    });
    expect(dropped.velocity.y.current).toBe(SLOW_FALL_SPEED);
  });

  it('should keep the top speed of the spike when it has dropped', () => {
    const dropped = createDroppedFallingSpike(
      createSpike(CEILING_TOP, NO_FALL_SPEED),
      SLOW_FALL_SPEED,
      BEFORE_FLOOR_TOP,
    );

    expect(dropped.velocity.y.max).toBe(TERMINAL_VELOCITY);
  });

  it('should mark the spike as falling when it has dropped', () => {
    const dropped = createDroppedFallingSpike(
      createSpike(CEILING_TOP, NO_FALL_SPEED),
      SLOW_FALL_SPEED,
      BEFORE_FLOOR_TOP,
    );

    expect(dropped.statuses.isFalling).toBe(true);
  });

  it('should leave the given spike unchanged when it drops', () => {
    const spike = createSpike(CEILING_TOP, NO_FALL_SPEED);

    createDroppedFallingSpike(spike, SLOW_FALL_SPEED, BEFORE_FLOOR_TOP);

    expect(spike).toEqual(createSpike(CEILING_TOP, NO_FALL_SPEED));
  });
});
