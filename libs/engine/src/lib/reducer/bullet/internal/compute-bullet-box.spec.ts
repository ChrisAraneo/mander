import type { Bullet } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { BULLET_HITBOX_INSET, BULLET_SIZE, BULLET_SPEED } from '../consts';
import { computeBulletBox } from './compute-bullet-box';

const createBulletAt = (left: number, top: number): Bullet => ({
  position: { x: left, y: top },
  velocity: { x: { current: BULLET_SPEED, max: BULLET_SPEED } },
});

describe('computeBulletBox', () => {
  it('should start the box just inside the corner of the bullet when the bullet is in flight', () => {
    const bullet = createBulletAt(100, 40);

    const box = computeBulletBox(bullet);

    expect(box.x).toBe(100 + BULLET_HITBOX_INSET);
    expect(box.y).toBe(40 + BULLET_HITBOX_INSET);
  });

  it('should make the box a little smaller than the bullet on every side when the bullet is in flight', () => {
    const bullet = createBulletAt(100, 40);

    const box = computeBulletBox(bullet);

    expect(box.width).toBe(BULLET_SIZE - 2 * BULLET_HITBOX_INSET);
    expect(box.height).toBe(BULLET_SIZE - 2 * BULLET_HITBOX_INSET);
  });

  it('should give the whole box when the bullet sits at the corner of the level', () => {
    const bullet = createBulletAt(0, 0);

    const box = computeBulletBox(bullet);

    expect(box).toEqual({ x: 1, y: 1, width: 8, height: 8 });
  });
});
