import type { Cannonball, Enemy } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createSalvo } from './create-salvo';
import type { ShooterShot } from './types/shooter-shot';

const ENEMY_LEFT = 320;
const ENEMY_TOP = 64;
const AMMO_LEFT = 330;
const AMMO_TOP = 70;
const AMMO_SIZE = 12;
const AMMO_SPEED = 220;

const createEnemy = (left: number): Enemy => ({
  kind: 'SHOOTER',
  position: { x: left, y: ENEMY_TOP },
  velocity: {
    x: { current: 0, max: 0 },
    y: { current: 0, max: 0 },
  },
  timers: { death: null, reload: 0 },
  spawn: { x: left, y: ENEMY_TOP },
  statuses: { isFacingRight: true, isGrounded: true },
});

const AMMO = {
  position: { x: AMMO_LEFT, y: AMMO_TOP },
  velocity: {
    x: { current: AMMO_SPEED, max: AMMO_SPEED },
    y: { current: 0, max: 0 },
  },
  size: AMMO_SIZE,
} as unknown as Cannonball;

const FIRED_SHOT: ShooterShot = {
  enemy: createEnemy(ENEMY_LEFT),
  cannonball: AMMO,
};

const HELD_SHOT: ShooterShot = {
  enemy: createEnemy(ENEMY_LEFT),
  cannonball: undefined,
};

describe('createSalvo', () => {
  it('should gather every enemy when it is given shots', () => {
    const salvo = createSalvo([FIRED_SHOT, HELD_SHOT]);

    expect(salvo.enemies).toEqual([FIRED_SHOT.enemy, HELD_SHOT.enemy]);
  });

  it('should gather only the ammunition that was fired when some shots were held', () => {
    const salvo = createSalvo([FIRED_SHOT, HELD_SHOT]);

    expect(salvo.cannonballs).toEqual([AMMO]);
  });

  it('should gather nothing when it is given no shots', () => {
    const salvo = createSalvo([]);

    expect(salvo).toEqual({ enemies: [], cannonballs: [] });
  });

  it('should leave the given shots unchanged when it gathers them', () => {
    createSalvo([FIRED_SHOT, HELD_SHOT]);

    expect(FIRED_SHOT.cannonball).toBe(AMMO);
    expect(HELD_SHOT.cannonball).toBeUndefined();
  });
});
