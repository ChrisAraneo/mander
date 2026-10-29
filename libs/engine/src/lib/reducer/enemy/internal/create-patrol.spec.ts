import { describe, expect, it } from 'vitest';

import {
  ENEMY_JUMP_VELOCITY,
  ENEMY_MOVE_SPEED,
  FLYING_ENEMY_MOVE_SPEED,
  HORNED_ENEMY_JUMP_VELOCITY,
} from '../consts';
import { createPatrol } from './create-patrol';

describe('createPatrol', () => {
  it('should set a still hopping enemy on the point when the kind is hopping', () => {
    const patrol = createPatrol({ x: 69, y: 42 }, 'HOPPING');

    expect(patrol).toEqual({
      kind: 'HOPPING',
      position: { x: 69, y: 42 },
      velocity: {
        x: { current: 0, max: ENEMY_MOVE_SPEED },
        y: { current: 0, max: ENEMY_JUMP_VELOCITY },
      },
      timers: { death: null, reload: 0 },
      spawn: { x: 69, y: 42 },
      statuses: { isFacingRight: true, isGrounded: false },
    });
  });

  it('should give the enemy the horned jump when the kind is horned', () => {
    const patrol = createPatrol({ x: 69, y: 42 }, 'HORNED');

    expect(patrol.kind).toBe('HORNED');
    expect(patrol.velocity.x.max).toBe(ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(HORNED_ENEMY_JUMP_VELOCITY);
  });

  it('should give the enemy no walking speed when the kind is flying', () => {
    const patrol = createPatrol({ x: 69, y: 42 }, 'FLYING');

    expect(patrol.kind).toBe('FLYING');
    expect(patrol.velocity.x.max).toBe(0);
    expect(patrol.velocity.y.max).toBe(FLYING_ENEMY_MOVE_SPEED);
  });

  it('should give the enemy the walking speed when the kind is beartrap', () => {
    const patrol = createPatrol({ x: 69, y: 42 }, 'BEARTRAP');

    expect(patrol.kind).toBe('BEARTRAP');
    expect(patrol.velocity.x.max).toBe(ENEMY_MOVE_SPEED);
    expect(patrol.velocity.y.max).toBe(ENEMY_JUMP_VELOCITY);
  });

  it('should give the enemy its own copies of the point when it is given a point', () => {
    const point = { x: 69, y: 42 };

    const patrol = createPatrol(point, 'HOPPING');

    expect(patrol.position).not.toBe(point);
    expect(patrol.spawn).not.toBe(point);
    expect(patrol.position).not.toBe(patrol.spawn);
  });

  it('should set the enemy at the corner when the point is at zero', () => {
    const patrol = createPatrol({ x: 0, y: 0 }, 'HOPPING');

    expect(patrol.position).toEqual({ x: 0, y: 0 });
    expect(patrol.spawn).toEqual({ x: 0, y: 0 });
  });
});
