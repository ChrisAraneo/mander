import { describe, expect, it } from 'vitest';

import {
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  FAST_ENEMY_MOVE_SPEED,
  FLYING_ENEMY_MOVE_SPEED,
  FREEZING_ENEMY_MOVE_SPEED,
  FREEZING_RELOAD_SECONDS,
  HORNED_ENEMY_JUMP_VELOCITY,
  SHOOTER_ENEMY_MOVE_SPEED,
  SHOOTER_RELOAD_SECONDS,
} from './consts';
import { createPatrol } from './create-patrol';

const SPAWN_LEFT = 69;
const SPAWN_TOP = 42;
const LEVEL_CORNER_LEFT = 0;
const LEVEL_CORNER_TOP = 0;
const NO_SPEED = 0;
const NO_RELOAD = 0;

const SPAWN = { x: SPAWN_LEFT, y: SPAWN_TOP };

describe('createPatrol', () => {
  it('should set a still hopping enemy on the point when the kind is hopping', () => {
    const patrol = createPatrol(SPAWN, 'HOPPING');

    expect(patrol).toEqual({
      kind: 'HOPPING',
      position: { x: SPAWN_LEFT, y: SPAWN_TOP },
      velocity: {
        x: { current: NO_SPEED, max: ENEMY_MOVE_SPEED },
        y: { current: NO_SPEED, max: ENEMY_JUMP_VELOCITY },
      },
      timers: { death: null, reload: NO_RELOAD },
      spawn: { x: SPAWN_LEFT, y: SPAWN_TOP },
      statuses: { isFacingRight: true, isGrounded: false },
    });
  });

  it('should give the enemy the horned jump when the kind is horned', () => {
    const patrol = createPatrol(SPAWN, 'HORNED');

    expect(patrol.kind).toBe('HORNED');
    expect(patrol.velocity.x.max).toBe(ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should give the enemy the faster walking speed when the kind is fast', () => {
    const patrol = createPatrol(SPAWN, 'FAST');

    expect(patrol.kind).toBe('FAST');
    expect(patrol.velocity.x.max).toBe(FAST_ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should give the enemy a loaded gun and a slower walk when the kind is shooter', () => {
    const patrol = createPatrol(SPAWN, 'SHOOTER');

    expect(patrol.kind).toBe('SHOOTER');
    expect(patrol.velocity.x.max).toBe(SHOOTER_ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
    expect(patrol.timers.reload).toBe(SHOOTER_RELOAD_SECONDS);
  });

  it('should give the enemy a loaded gun and a slower walk when the kind is freezing', () => {
    const patrol = createPatrol(SPAWN, 'FREEZING');

    expect(patrol.kind).toBe('FREEZING');
    expect(patrol.velocity.x.max).toBe(FREEZING_ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
    expect(patrol.timers.reload).toBe(FREEZING_RELOAD_SECONDS);
  });

  it('should give the enemy no walking speed when the kind is flying', () => {
    const patrol = createPatrol(SPAWN, 'FLYING');

    expect(patrol.kind).toBe('FLYING');
    expect(patrol.velocity.x.max).toBe(NO_SPEED);
    expect(patrol.velocity.y.max).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should give the enemy the walking speed when the kind is beartrap', () => {
    const patrol = createPatrol(SPAWN, 'BEARTRAP');

    expect(patrol.kind).toBe('BEARTRAP');
    expect(patrol.velocity.x.max).toBe(ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(ENEMY_JUMP_VELOCITY);
  });

  it('should give the enemy its own copies of the point when it is given a point', () => {
    const patrol = createPatrol(SPAWN, 'HOPPING');

    expect(patrol.position).not.toBe(SPAWN);
    expect(patrol.spawn).not.toBe(SPAWN);
    expect(patrol.position).not.toBe(patrol.spawn);
  });

  it('should set the enemy at the corner when the point is at zero', () => {
    const patrol = createPatrol(
      { x: LEVEL_CORNER_LEFT, y: LEVEL_CORNER_TOP },
      'HOPPING',
    );

    expect(patrol.position).toEqual({
      x: LEVEL_CORNER_LEFT,
      y: LEVEL_CORNER_TOP,
    });
    expect(patrol.spawn).toEqual({
      x: LEVEL_CORNER_LEFT,
      y: LEVEL_CORNER_TOP,
    });
  });
});
