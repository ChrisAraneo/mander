import type { Player } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createBasePlayerVelocity } from '../player/create-base-player-velocity';
import { BULLET_SPEED } from './consts';
import { fireBullet } from './fire-bullet';

const createFacingPlayer = (isFacingRight: boolean): Player => ({
  position: { x: 100, y: 200 },
  velocity: createBasePlayerVelocity(),
  hearts: { value: 3 },
  timers: { death: null, invincibility: 0, star: 0, hurt: 0 },
  statuses: { isFacingRight, isGrounded: true, isJumpQueued: false },
});

describe('fireBullet', () => {
  it('should put the bullet at the muzzle of the player when the player fires', () => {
    const player = createFacingPlayer(true);

    const bullet = fireBullet(player);

    expect(bullet.position.x).toBe(106);
    expect(bullet.position.y).toBeCloseTo(226.2, 6);
  });

  it('should put the bullet at the same muzzle when the player faces left', () => {
    const player = createFacingPlayer(false);

    const bullet = fireBullet(player);

    expect(bullet.position.x).toBe(106);
    expect(bullet.position.y).toBeCloseTo(226.2, 6);
  });

  it('should send the bullet to the right when the player faces right', () => {
    const player = createFacingPlayer(true);

    const bullet = fireBullet(player);

    expect(bullet.velocity).toEqual({
      x: { current: BULLET_SPEED, max: BULLET_SPEED },
    });
  });

  it('should send the bullet to the left when the player faces left', () => {
    const player = createFacingPlayer(false);

    const bullet = fireBullet(player);

    expect(bullet.velocity).toEqual({
      x: { current: -BULLET_SPEED, max: BULLET_SPEED },
    });
  });

  it('should leave the player alone when the player fires', () => {
    const player = createFacingPlayer(true);

    fireBullet(player);

    expect(player).toEqual(createFacingPlayer(true));
  });
});
