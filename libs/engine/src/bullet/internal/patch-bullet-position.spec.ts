import type { Bullet } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { BULLET_SPEED } from '../consts';
import { patchBulletPosition } from './patch-bullet-position';

const createBullet = (speed: number): Bullet => ({
  position: { x: 10, y: 20 },
  velocity: { x: { current: speed, max: BULLET_SPEED } },
});

describe('patchBulletPosition', () => {
  it('should move the bullet right by its speed times the time passed when it flies right', () => {
    const bullet = createBullet(BULLET_SPEED);

    const result = patchBulletPosition(bullet, 0.5);

    expect(result.position).toEqual({ x: 220, y: 20 });
  });

  it('should move the bullet left by its speed times the time passed when it flies left', () => {
    const bullet = createBullet(-BULLET_SPEED);

    const result = patchBulletPosition(bullet, 0.25);

    expect(result.position).toEqual({ x: -95, y: 20 });
  });

  it('should keep the bullet where it is when no time has passed', () => {
    const bullet = createBullet(BULLET_SPEED);

    const result = patchBulletPosition(bullet, 0);

    expect(result.position).toEqual({ x: 10, y: 20 });
  });

  it('should keep the same speed when it moves the bullet', () => {
    const bullet = createBullet(BULLET_SPEED);

    const result = patchBulletPosition(bullet, 0.5);

    expect(result.velocity).toBe(bullet.velocity);
  });

  it('should leave the given bullet where it was when it moves the bullet', () => {
    const bullet = createBullet(BULLET_SPEED);
    const position = bullet.position;

    patchBulletPosition(bullet, 0.5);

    expect(bullet.position).toBe(position);
    expect(bullet.position).toEqual({ x: 10, y: 20 });
  });
});
